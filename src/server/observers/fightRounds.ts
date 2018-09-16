import { Client } from "../../client/client"
import Maybe from "../../functional/maybe"
import { newContainer } from "../../item/factory"
import { Attack } from "../../mob/fight/attack"
import { filterCompleteFights, getFights } from "../../mob/fight/fight"
import { Round } from "../../mob/fight/round"
import { Mob } from "../../mob/model/mob"
import Table from "../../room/table"
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

export function attackMessage(attack: Attack, mob: Mob): string {
  let message = ""
  if (attack.attacker === mob) {
    message = "You hit " + attack.defender.name + "."
    if (!attack.isDefenderAlive) {
      message += `\n${attack.defender.name} has DIED!`
      message += `\nYou gained ${attack.experience} experience points.`
    }
  } else if (attack.defender === mob) {
    message = attack.attacker.name + " hits you."
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
      this.table.canonical(round.victor.room).inventory.addItem(
        newContainer(`a corpse of ${round.vanquished.name}`, "A corpse"))
    }
  }
}
