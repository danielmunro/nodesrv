import { addFight, Fight } from "../../mob/fight/fight"
import { findOneMob } from "../../mob/repository/mob"
import { Request } from "../../server/request/request"
import { ATTACK_MOB, MOB_NOT_FOUND } from "../actions"

export default function(request: Request): Promise<any> {
  return new Promise((resolve) => {
    const target = request.getRoom().mobs.find((mob) => mob.matches(request.subject))
    if (!target) {
      return resolve({ message: MOB_NOT_FOUND })
    }
    return findOneMob(target.id).then((mobTarget) => {
      const fight = new Fight(request.player.sessionMob, mobTarget)
      addFight(fight)
      return resolve({ message: ATTACK_MOB })
    })
  })
}
