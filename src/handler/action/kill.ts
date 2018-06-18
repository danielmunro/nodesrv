import match from "../../matcher/match"
import { addFight, Fight } from "../../mob/fight/fight"
import { findOneMob } from "../../mob/repository/mob"
import { Request } from "../../request/request"

export const MOB_NOT_FOUND = "They aren't here."
export const ATTACK_MOB = "You scream and attack!"

export default function(request: Request): Promise<any> {
  return new Promise((resolve) => {
    const target = request.getRoom().mobs.find((mob) => match(mob.name, request.subject))
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
