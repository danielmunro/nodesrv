import CheckedRequest from "../../check/checkedRequest"
import Response from "../../request/response"
import { CheckType } from "../../check/checkType"
import { Skill } from "../model/skill"
import roll from "../../random/dice"
import { Thresholds } from "./constants"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
  const skill = checkedRequest.getCheckTypeResult(CheckType.HasSkill)
  const item = checkedRequest.getCheckTypeResult(CheckType.HasItem)
  const mob = checkedRequest.mob
  const responseBuilder = checkedRequest.respondWith()

  if (calculateSharpenSaves(skill) > Thresholds.Sharpen) {

  }
}

function calculateSharpenSaves(skill: Skill) {
  return roll(1, skill.level / 10)
}
