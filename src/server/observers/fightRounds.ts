import { Client } from "../../client/client"
import Maybe from "../../functional/maybe"
import { newContainer } from "../../item/factory"
import { Attack } from "../../mob/fight/attack"
import { filterCompleteFights, getFights } from "../../mob/fight/fight"
import { Round } from "../../mob/fight/round"
import { Mob } from "../../mob/model/mob"
import Table from "../../room/table"
import { Observer } from "./observer"

export function getHealthIndicator(percent): string {
  if (percent === 1) {
    return "is in excellent condition"
  } else if (percent > .9) {
    return "has a few scratches"
  } else if (percent > .75) {
    return "has some small wounds and bruises"
  } else if (percent > .5) {
    return "has quite a few wounds"
  } else if (percent > .3) {
    return "has some big nasty wounds and scratches"
  } else if (percent > .15) {
    return "looks pretty hurt"
  } else if (percent > 0) {
    return "is in awful condition"
  }

  return "is bleeding to death"
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
  if (round.attack.attacker === sessionMob || round.attack.defender === sessionMob) {
    let message = attackMessage(round.attack, sessionMob)
    if (round.counter) {
      message += "\n" + attackMessage(round.counter, sessionMob)
    }
    const opponent = round.attack.attacker === sessionMob ? round.attack.defender : round.attack.attacker
    if (!round.isFatality) {
      message += "\n" + opponent.name + " " + getHealthIndicator(
        opponent.vitals.hp / opponent.getCombinedAttributes().vitals.hp) + "."
    }
    return message
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
    const attack = round.attack
    FightRounds.getClientFromMobMap(clientMobMap, attack.attacker).do((client) =>
      FightRounds.updateClient(client, attack.attacker, round))
    FightRounds.getClientFromMobMap(clientMobMap, attack.defender).do((client) =>
      FightRounds.updateClient(client, attack.defender, round))
    if (round.isFatality) {
      this.table.roomsById[round.victor.room.uuid].inventory.addItem(
        newContainer(`a corpse of ${round.vanquished.name}`, "A corpse"))
    }
  }
}
