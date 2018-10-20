import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import { CheckType } from "../../check/checkType"
import { Skill } from "../model/skill"
import roll from "../../random/dice"
import { Messages, Thresholds } from "./constants"
import { newAffect, newPermanentAffect } from "../../affect/factory"
import { Affect } from "../../affect/model/affect"
import { AffectType } from "../../affect/affectType"
import { newAttributes, newAttributesWithHitroll, newHitroll } from "../../attributes/factory"

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
