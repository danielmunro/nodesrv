import { Client } from "../../client/client"
import { Attack } from "../../mob/fight/attack"
import { filterCompleteFights, getFights } from "../../mob/fight/fight"
import { Round } from "../../mob/fight/round"
import { Mob } from "../../mob/model/mob"
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
      message += "\n" + attack.defender.name + " has DIED!"
    }
  } else if (attack.defender === mob) {
    message = attack.attacker.name + " hits you."
    if (!attack.isDefenderAlive) {
      message += "\nYou have DIED!"
    }
  }

  return message
}

function createMessageFromFightRound(round: Round, sessionMob: Mob) {
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

export class FightRounds implements Observer {
  public notify(clients: Client[]): void {
    const rounds = getFights().map((fight) => fight.round())
    filterCompleteFights()
    clients.map((client) =>
      rounds.map((round) => {
        const message = createMessageFromFightRound(round, client.getPlayer().sessionMob)
        if (message) {
          client.send({ message })
        }
      }))
  }
}
