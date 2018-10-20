import { AffectType } from "../../affect/affectType"
import { newPermanentAffect } from "../../affect/factory"
import { newAttributesWithHitroll, newHitroll } from "../../attributes/factory"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import roll from "../../random/dice"
import Response from "../../request/response"
import { Skill } from "../model/skill"
import { Messages, Thresholds } from "./constants"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const target = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  const responseBuilder = checkedRequest.respondWith()

  if (calculateSharpenSaves(skill) < Thresholds.Sharpen) {
    return responseBuilder.fail(
      Messages.Sharpen.Failure,
      { verb: "fail", target },
      { verb: "fail", target },
      { verb: "fails", target })
  }

  target.affects.push(newPermanentAffect(
    AffectType.Sharpened,
    newAttributesWithHitroll(newHitroll(1, roll(1, skill.level / 10) + 1))))

  return responseBuilder.success(
    Messages.Sharpen.Success,
    { verb: "sharpen", target },
    { verb: "sharpen", target },
    { verb: "sharpens", target })
}

function calculateSharpenSaves(skill: Skill) {
  return roll(1, skill.level / 10)
}
