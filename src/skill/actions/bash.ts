import roll from "../../dice/dice"
import { getFights } from "../../mob/fight/fight"
import { Request } from "../../server/request/request"
import { SkillType } from "../../skill/skillType"

export const DELAY = 2
export const MESSAGE_NO_SKILL = "You bash around helplessly."
export const MESSAGE_NO_TARGET = "You aren't fighting anyone!"
export const MESSAGE_FAIL = "You fall flat on your face!"

export default function(request: Request): Promise<any> {
  return new Promise((resolve) => {
    const sessionMob = request.player.sessionMob
    const fight = getFights().find((f) => f.isParticipant(sessionMob))

    if (!fight) {
      return resolve({ message: MESSAGE_NO_TARGET })
    }

    const skill = sessionMob.skills.find((s) => s.skillType === SkillType.Bash)

    if (!skill) {
      return resolve({ message: MESSAGE_NO_SKILL })
    }

    request.player.delay += DELAY
    const target = fight.getOpponentFor(sessionMob)

    if (roll(1, skill.level) - roll(1, target.getCombinedAttributes().stats.dex * 3) < 0) {
      return resolve({ message: MESSAGE_FAIL })
    }

    target.vitals.hp--

    return resolve({ message: "You slam into " + sessionMob.name + " and send them flying!" })
  })
}
