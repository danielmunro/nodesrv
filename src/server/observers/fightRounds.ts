import {inject, injectable} from "inversify"
import {Client} from "../../client/client"
import {ItemEntity} from "../../item/entity/itemEntity"
import {Equipment} from "../../item/enum/equipment"
import {MobEntity} from "../../mob/entity/mobEntity"
import {AttackVerb} from "../../mob/enum/attackVerb"
import {Attack} from "../../mob/fight/attack"
import {getPhysicalDamageDescriptor} from "../../mob/fight/damageDescriptor"
import healthIndicator from "../../mob/fight/healthIndicator"
import {Round} from "../../mob/fight/round"
import {BodyPart} from "../../mob/race/enum/bodyParts"
import MobService from "../../mob/service/mobService"
import Maybe from "../../support/functional/maybe/maybe"
import withValue from "../../support/functional/withValue"
import {simpleD4} from "../../support/random/dice"
import {format} from "../../support/string"
import {Types} from "../../support/types"
import {Messages, Messages as ServerObserverMessages} from "./constants"
import {Observer} from "./observer"

enum AttackLabel {
  Regular = "(reg)",
  Second = "(2nd)",
  Third = "(3rd)",
}

const allAttacks = [
  AttackLabel.Regular,
  AttackLabel.Second,
  AttackLabel.Third,
]

export function getHealthIndicator(percent: number): string {
  return new Maybe<string>(healthIndicator.find((i) => percent > i.amount))
    .do((indicator) => indicator.message)
    .or(() => "has bleeding to death")
    .get()
}

function getAttackVerb(weapon: ItemEntity): AttackVerb {
  return new Maybe<AttackVerb>(weapon).do(w => w.attackVerb).or(() => AttackVerb.Hit).get()
}

export function attackMessage(attack: Attack, mob: MobEntity): string {
  const d = getPhysicalDamageDescriptor(attack.damage)
  const equipped = mob.equipped.items.find(i => i.equipment === Equipment.Weapon)
  const attackVerb = equipped ? getAttackVerb(equipped) : AttackVerb.Punch
  if (attack.attacker === mob) {
    let attackerMessage = format(
      "Your {0} {1} {2} {3}{4}",
      d[0], attackVerb, d[1], attack.defender.name, d[2])
    if (!attack.isDefenderAlive) {
      attackerMessage += `\n${attack.defender.name} has DIED!`
      attackerMessage += `\nYou gained ${attack.experience} experience points.`
    }

    return attackerMessage
  }

  if (attack.defender === mob) {
    let defenderMessage = format(
      "{0}'s {1} {2} {3} you{4}",
    attack.attacker.name, d[0], attackVerb, d[1], d[2])
    if (!attack.isDefenderAlive) {
      defenderMessage += "\nYou have DIED!"
    }

    return defenderMessage
  }

  let roomMessage = format(
    "{0}'s {1} {2} {3} {4}{5}",
    attack.attacker.name, d[0], attackVerb, d[1], attack.defender.name, d[2])
  if (!attack.isDefenderAlive) {
    roomMessage += format("\n{0} has DIED!", attack.defender.name)
  }

  return roomMessage
}

function getFatalityMessages(round: Round): string[] {
  const messages = []
  const vanquished = round.vanquished as MobEntity
  messages.push(format(Messages.Fight.DeathCry, vanquished.name))
  simpleD4(() => messages.push(format(Messages.Fight.BloodSplatter, vanquished.name)))
  if (round.bodyParts) {
    messages.push(...round.bodyParts.map(bodyPart => getBodyPartMessage(vanquished, bodyPart)))
  }

  return messages
}

function getBodyPartMessage(mob: MobEntity, bodyPart: BodyPart): string {
  const m = ServerObserverMessages.Fight.BodyParts
  switch (bodyPart) {
    case BodyPart.Guts:
      return format(m.Guts, mob.name, mob.gender)
    case BodyPart.Head:
      return format(m.Head, mob.name, mob.gender)
    case BodyPart.Heart:
      return format(m.Heart, mob.name, mob.gender)
    case BodyPart.Brains:
      return format(m.Brains, mob.name, mob.gender)
    default:
      return format(m.Default, mob.name, bodyPart, mob.gender)
  }
}

function createMessageFromFightRound(round: Round, sessionMob: MobEntity): string {
  const messages = []
  const lastAttack = round.getLastAttack()
  const attacker = lastAttack.attacker
  const defender = lastAttack.defender

  const mapper = (r: Attack, i: number) =>
    (r.attacker === sessionMob ? allAttacks[i] + " " : "") + attackMessage(r, sessionMob)
  messages.push(...round.attacks.map(mapper))
  messages.push(...round.counters.map(mapper))

  if (round.isFatality) {
    messages.push(...getFatalityMessages(round))
  } else if (round.isParticipant(sessionMob)) {
    messages.push(withValue(attacker === sessionMob ? defender : attacker, (opponent: MobEntity) =>
      opponent.name + " " +
      getHealthIndicator(opponent.hp / opponent.attribute().getMaxHp()) + "."))
  }

  return messages.join("\n")
}

@injectable()
export class FightRounds implements Observer {
  private static createClientMobMap(clients: Client[]): object {
    const clientMobMap: {[key: string]: Client} = {}
    clients
      .filter((c) => c.isLoggedIn())
      .forEach((client) => clientMobMap[client.player.sessionMob.name] = client)
    return clientMobMap
  }

  private static updateClient(client: Client, mob: MobEntity, round: Round) {
    const message = createMessageFromFightRound(round, mob)
    client.send({ message })
    client.sendMessage(client.player.prompt())
  }
  constructor(@inject(Types.MobService) private readonly mobService: MobService) {}

  public async notify(clients: Client[]) {
    const rounds = await this.proceedAllFightRounds()
    const clientMobMap = FightRounds.createClientMobMap(clients)
    this.mobService.filterCompleteFights()
    rounds.forEach(round => this.updateRound(round, clientMobMap))
  }

  private updateRound(round: Round, clientMobMap: any) {
    const location = this.mobService.getLocationForMob(round.fight.aggressor)
    this.mobService.getMobsByRoom(location.room).forEach(mob =>
      new Maybe(clientMobMap[mob.name])
        .do(() => this.updateClientIfMobIsOwned(clientMobMap, mob, round)))
  }

  private async proceedAllFightRounds(): Promise<Round[]> {
    return this.mobService.doFightRounds()
  }

  private updateClientIfMobIsOwned(clientMobMap: any, mob: MobEntity, round: Round): void {
    new Maybe(clientMobMap[mob.name]).do((client) =>
      FightRounds.updateClient(client, mob, round))
  }
}
