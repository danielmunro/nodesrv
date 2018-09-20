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

function createHealthMap(amount: number, message: string) {
  return { amount, message }
}

const healthMap = [
  createHealthMap(1, "is in excellent condition"),
  createHealthMap(0.9, "has a few scratches"),
  createHealthMap(0.75, "has some small wounds and bruises"),
  createHealthMap(0.5, "has quite a few wounds"),
  createHealthMap(0.3, "has some big nasty wounds and scratches"),
  createHealthMap(0.15, "looks pretty hurt"),
  createHealthMap(0, "is in awful condition"),
]

export function getHealthIndicator(percent): string {
  return new Maybe(healthMap.find((i) => percent > i.amount))
    .do((indicator) => indicator.message)
    .or(() => "is bleeding to death")
    .get()
}

function newDamageDescriptor(damage: number, descriptors: string[]) {
  return { damage, descriptors }
}

const damageDescriptorMap = [
  newDamageDescriptor(0, ["clumsy", "misses", " harmlessly."]),
  newDamageDescriptor(4, ["clumsy", "gives", " a bruise."]),
  newDamageDescriptor(8, ["wobbly", "hits", " making scrapes."]),
  newDamageDescriptor(12, ["lucky", "hits", " causing scratches."]),
  newDamageDescriptor(16, ["amateur", "hits", " causing light wounds."]),
  newDamageDescriptor(20, ["amateur", "strikes", ", the wound bleeds."]),
  newDamageDescriptor(26, ["competent", "strikes", ", hitting an organ."]),
  newDamageDescriptor(32, ["competent", "causes", " to gasp in pain."]),
  newDamageDescriptor(38, ["skillful", "causes", " harm!"]),
  newDamageDescriptor(44, ["skillful", "has a devastating effect on", "."]),
  newDamageDescriptor(50, ["cunning", "tears into", ", shredding flesh."]),
  newDamageDescriptor(60, ["strong", "causes", " to spurt blood!"]),
  newDamageDescriptor(70, ["calculated", "leaves large gashes on", "!"]),
  newDamageDescriptor(80, ["calculated", "tears", " leaving a GAPING hole!"]),
  newDamageDescriptor(87, ["well aimed", "DISEMBOWELS", ". Guts spill out!!"]),
  newDamageDescriptor(94, ["calm", "DISMEMBERS", "! Blood splatters!"]),
  newDamageDescriptor(105, ["wicked", "ANNIHILATES", "!!"]),
  newDamageDescriptor(117, ["wicked", "OBLITERATES", " completely!!"]),
  newDamageDescriptor(125, ["barbaric", "MASSACRES", ". Blood flies!"]),
  newDamageDescriptor(130, ["controlled", "ERADICATES", " to bits!!"]),
]

function getDamageDescriptors(damage: number): string[] {
  return new Maybe(damageDescriptorMap.find(m => damage <= m.damage))
    .do(m => m.descriptors)
    .or(() => ["masterful", "does UNSPEAKABLE things to", "!"])
    .get()
}

export function attackMessage(attack: Attack, mob: Mob): string {
  let message = ""
  const d = getDamageDescriptors(attack.damage)
  if (attack.attacker === mob) {
    message = format(
      "Your {0} attack {1} {2}{3}",
      d[0], d[1], attack.defender.name, d[2])
    if (!attack.isDefenderAlive) {
      message += `\n${attack.defender.name} has DIED!`
      message += `\nYou gained ${attack.experience} experience points.`
    }
  } else if (attack.defender === mob) {
    message = format(
      "{0}'s {1} attack {2} you{3}",
    attack.defender.name, d[0], d[1], d[2])
    if (!attack.isDefenderAlive) {
      message += "\nYou have DIED!"
    }
  }

  return message
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
