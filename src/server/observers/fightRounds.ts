import { Client } from "../../client/client"
import Maybe from "../../functional/maybe"
import { newContainer } from "../../item/factory"
import { Item } from "../../item/model/item"
import { Attack } from "../../mob/fight/attack"
import { filterCompleteFights, getFights } from "../../mob/fight/fight"
import { Round } from "../../mob/fight/round"
import { Mob } from "../../mob/model/mob"
import Table from "../../room/table"
import { format } from "../../support/string"
import { Messages } from "./constants"
import { Observer } from "./observer"
import damageDescriptor from "../../mob/fight/damageDescriptor"
import { Equipment } from "../../item/equipment"
import { AttackVerb } from "../../mob/fight/attackVerb"
import healthIndicator from "../../mob/fight/healthIndicator"

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
  const attackVerb = getAttackVerb(mob.equipped.inventory.items.find(i => i.equipment === Equipment.Weapon))
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

function createMessageFromFightRound(round: Round, sessionMob: Mob): string {
  const messages = []
  const lastAttack = round.getLastAttack()
  const attacker = lastAttack.attacker
  const defender = lastAttack.defender

  if (attacker === sessionMob || defender === sessionMob) {
    const mapper = (r, i) =>
      (r.attacker === sessionMob ? allAttacks[i] + " " : "") + attackMessage(r, sessionMob)
    messages.push(...round.attacks.map(mapper))
    messages.push(...round.counters.map(mapper))

    if (!round.isFatality) {
      const opponent = attacker === sessionMob ? defender : attacker
      messages.push(opponent.name + " " + getHealthIndicator(
        opponent.vitals.hp / opponent.getCombinedAttributes().vitals.hp) + ".")
    }

    return messages.join("\n")
  }
}

export function createClientMobMap(clients: Client[]): object {
  const clientMobMap = {}
  clients
    .filter((c) => c.isLoggedIn())
    .forEach((client) => clientMobMap[client.player.sessionMob.name] = client)

  return clientMobMap
}

export function getCorpse(mob: Mob): Item {
  const corpse = newContainer(
    format(Messages.Fight.Corpse.Name, mob.name),
    format(Messages.Fight.Corpse.Description, mob.name))
  mob.inventory.items.forEach(item =>
    corpse.containerInventory.getItemFrom(item, mob.inventory))
  mob.equipped.inventory.items.forEach(item =>
    corpse.containerInventory.getItemFrom(item, mob.equipped.inventory))

  return corpse
}

export class FightRounds implements Observer {
  private static getClientFromMobMap(clientMobMap, mob): Maybe<Client> {
    return new Maybe(clientMobMap[mob.name])
  }

  private static updateClient(client, mob, round) {
    const message = createMessageFromFightRound(round, mob)
    client.send({ message })
    client.sendMessage(client.player.prompt())
  }

  constructor(private readonly table: Table) {}

  public async notify(clients: Client[]) {
    const rounds = await Promise.all(getFights().map((fight) => fight.round()))
    const clientMobMap = createClientMobMap(clients)
    filterCompleteFights()
    rounds.forEach((round: Round) => this.updateRound(round, clientMobMap))
  }

  private updateRound(round: Round, clientMobMap) {
    const attack = round.getLastAttack()
    FightRounds.getClientFromMobMap(clientMobMap, attack.attacker).do((client) =>
      FightRounds.updateClient(client, attack.attacker, round))
    FightRounds.getClientFromMobMap(clientMobMap, attack.defender).do((client) =>
      FightRounds.updateClient(client, attack.defender, round))

    if (round.isFatality) {
      this.table.canonical(round.victor.room).inventory.addItem(getCorpse(round.vanquished))
    }
  }
}
