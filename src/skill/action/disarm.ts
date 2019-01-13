import CheckedRequest from "../../check/checkedRequest"
import { CheckType } from "../../check/checkType"
import { Mob } from "../../mob/model/mob"
import roll from "../../random/dice"
import Response from "../../request/response"
import { Skill } from "../model/skill"
import { Messages, Thresholds } from "./constants"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const mob = checkedRequest.mob
  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const target = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
  const responseBuilder = checkedRequest.respondWith()

  if (calculateDisarm(mob, target, skill) < Thresholds.Disarm) {
    return responseBuilder.fail(
      Messages.Disarm.Failure,
      { target, verb: "fail" },
      { target, verb: "fails" })
  }

  const item = checkedRequest.getCheckTypeResult(CheckType.ItemPresent)
  checkedRequest.room.inventory.addItem(item)

  return responseBuilder.success(
    Messages.Disarm.Success,
    { target, gender: target.gender, verb: "disarm" },
    { target, gender: target.gender, verb: "disarms" })
}

function calculateDisarm(mob: Mob, target: Mob, skill: Skill): number {
  return roll(4, (Math.max(1, mob.level - target.level) + skill.level) / 2)
}
