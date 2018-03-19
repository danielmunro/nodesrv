import { v4 } from "uuid"
import { Client } from "../../client/client"
import { Attack } from "../../mob/attack"
import { filterCompleteFights, getFights } from "../../mob/fight"
import { Mob } from "../../mob/model/mob"
import { Observer } from "./observer"

// @todo de-dup
function attackMessage(attack: Attack, client: Client) {
  const sessionMob = client.getPlayer().sessionMob
  if (attack.attacker === sessionMob) {
    client.send({ message: "You hit " + attack.defender.name + "." })
    if (!attack.isDefenderAlive) {
      client.send({ message: attack.defender.name + " has DIED!" })
    }
  } else if (attack.defender === sessionMob) {
    client.send({ message: attack.attacker.name + " hits you. " })
    if (!attack.isDefenderAlive) {
      client.send({ message: "You have DIED!" })
    }
  }
}

export class FightRounds implements Observer {
  public notify(clients: Client[]): void {
    const rounds = getFights().map((fight) => fight.round())
    filterCompleteFights()
    clients.map((client) => {
      const sessionMob = client.getPlayer().sessionMob
      rounds.map((round) => {
        attackMessage(round.attack, client)
        if (round.counter) {
          attackMessage(round.counter, client)
        }
      })
    })
  }
}
