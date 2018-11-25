import { Client } from "../../client/client"
import Maybe from "../../support/functional/maybe"
import withValue from "../../support/functional/withValue"
import { Equipment } from "../../item/equipment"
import { Item } from "../../item/model/item"
import { Attack } from "../../mob/fight/attack"
import { AttackVerb } from "../../mob/fight/attackVerb"
import damageDescriptor from "../../mob/fight/damageDescriptor"
import healthIndicator from "../../mob/fight/healthIndicator"
import { Round } from "../../mob/fight/round"
import MobService from "../../mob/mobService"
import { Mob } from "../../mob/model/mob"
import { getBodyPartMessage } from "../../mob/race/bodyParts"
import { simpleD4 } from "../../random/dice"
import { format } from "../../support/string"
import { Messages } from "./constants"
import { Observer } from "./observer"

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

export function getHealthIndicator(percent): string {
  return new Maybe(healthIndicator.find((i) => percent > i.amount))
    .do((indicator) => indicator.message)
    .or(() => "is bleeding to death")
    .get()
}

function getDamageDescriptor(damage: number): string[] {
  return new Maybe(damageDescriptor.find(m => damage <= m.damage))
    .do(m => m.descriptors)
    .or(() => ["masterful", "does UNSPEAKABLE things to", "!"])
    .get()
}

function getAttackVerb(weapon: Item): AttackVerb {
  return new Maybe(weapon).do(w => w.attackVerb).or(() => AttackVerb.Hit).get()
}

export function attackMessage(attack: Attack, mob: Mob): string {
  const d = getDamageDescriptor(attack.damage)
  const attackVerb = getAttackVerb(mob.equipped.items.find(i => i.equipment === Equipment.Weapon))
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
  messages.push(format(Messages.Fight.DeathCry, round.vanquished.name))
  simpleD4(() => messages.push(format(Messages.Fight.BloodSplatter, round.vanquished.name)))
  if (round.bodyPart) {
    messages.push(getBodyPartMessage(round.vanquished, round.bodyPart))
  }

  return messages
}

function createMessageFromFightRound(round: Round, sessionMob: Mob): string {
  const messages = []
  const lastAttack = round.getLastAttack()
  const attacker = lastAttack.attacker
  const defender = lastAttack.defender

  const mapper = (r, i) =>
    (r.attacker === sessionMob ? allAttacks[i] + " " : "") + attackMessage(r, sessionMob)
  messages.push(...round.attacks.map(mapper))
  messages.push(...round.counters.map(mapper))

  if (round.isFatality) {
    messages.push(...getFatalityMessages(round))
  } else if (round.isParticipant(sessionMob)) {
    messages.push(withValue(attacker === sessionMob ? defender : attacker, (opponent: Mob) =>
      opponent.name + " " + getHealthIndicator(opponent.vitals.hp / opponent.getCombinedAttributes().vitals.hp) + "."))
  }

  return messages.join("\n")
}

export function createClientMobMap(clients: Client[]): object {
  const clientMobMap = {}
  clients
    .filter((c) => c.isLoggedIn())
    .forEach((client) => clientMobMap[client.player.sessionMob.name] = client)

  return clientMobMap
}

export class FightRounds implements Observer {
  private static updateClient(client, mob, round) {
    const message = createMessageFromFightRound(round, mob)
    client.send({ message })
    client.sendMessage(client.player.prompt())
  }
  constructor(private readonly mobService: MobService) {}

  public async notify(clients: Client[]) {
    const rounds = await this.proceedAllFightRounds()
    const clientMobMap = createClientMobMap(clients)
    this.mobService.filterCompleteFights()
    rounds.forEach(round => this.updateRound(round, clientMobMap))
  }

  private updateRound(round: Round, clientMobMap) {
    this.mobService.locationService.getMobsByRoom(round.room).forEach(mob =>
      new Maybe(clientMobMap[mob.name])
        .do(() => this.updateClientIfMobIsOwned(clientMobMap, mob, round)))
  }

  private async proceedAllFightRounds(): Promise<Round[]> {
    return this.mobService.doFightRounds()
  }

  private updateClientIfMobIsOwned(clientMobMap, mob, round): void {
    new Maybe(clientMobMap[mob.name]).do((client) =>
      FightRounds.updateClient(client, mob, round))
  }
}
