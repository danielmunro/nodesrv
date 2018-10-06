import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import { Mob } from "../../mob/model/mob"
import roll from "../../random/dice"
import Response from "../../request/response"
import { format } from "../../support/string"
import { Skill } from "../model/skill"
import { Messages, Thresholds } from "./constants"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const mob = checkedRequest.mob
  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const target = checkedRequest.getCheckTypeResult(CheckType.IsFighting)
  const responseBuilder = checkedRequest.respondWith()

  if (calculateDisarm(mob, target, skill) < Thresholds.Disarm) {
    return responseBuilder.fail(format(Messages.Disarm.Failure, target.name))
  }

  return responseBuilder.success(format(Messages.Disarm.Success, target.name, target.gender))
}

function calculateDisarm(mob: Mob, target: Mob, skill: Skill): number {
  return roll(2, Math.max(1, mob.level - target.level) + skill.level)
}
