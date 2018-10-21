import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import { Mob } from "../../mob/model/mob"
import roll from "../../random/dice"
import Response from "../../request/response"
import { Messages } from "../constants"
import { Skill } from "../model/skill"
import { Thresholds } from "./constants"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const mob = checkedRequest.mob
  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const responseBuilder = checkedRequest.respondWith()
  const target = checkedRequest.getCheckTypeResult(CheckType.IsFighting)

  if (calculateDirtKickRoll(mob, skill) < Thresholds.DirtKick) {
    return responseBuilder.fail(Messages.DirtKick.Fail)
  }

  target.addAffect(newAffect(AffectType.Blind, Math.max(1, mob.level / 12)))

  return responseBuilder.success(Messages.DirtKick.Success)
}

function calculateDirtKickRoll(mob: Mob, skill: Skill): number {
  return roll(1, mob.level) + roll(2, skill.level)
}
