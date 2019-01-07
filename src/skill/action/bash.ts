import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import roll from "../../random/dice"
import Response from "../../request/response"
import { Messages } from "../constants"
import { SkillType } from "../skillType"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const mob = checkedRequest.mob
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
  const skill = mob.skills.find(s => s.skillType === SkillType.Bash)
  const responseBuilder = checkedRequest.respondWith()

  if (roll(1, skill.level) - roll(1, target.getCombinedAttributes().stats.dex * 3) < 0) {
    return responseBuilder.fail(Messages.Bash.Fail)
  }

  target.vitals.hp--
  target.addAffect(newAffect(AffectType.Stunned))

  return responseBuilder.success(Messages.Bash.Success, { target }, { target })
}
