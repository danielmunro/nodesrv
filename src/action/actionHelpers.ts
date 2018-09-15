import { Item } from "../item/model/item"
import { Request } from "../request/request"
import Response from "../request/response"
import ResponseBuilder from "../request/responseBuilder"
import { ResponseStatus } from "../request/responseStatus"
import Attempt from "../skill/attempt"
import { CheckResult } from "../skill/checkResult"
import { skillCollection } from "../skill/skillCollection"
import { SkillType } from "../skill/skillType"
import AttemptContext from "../skill/attemptContext"
import { Trigger } from "../mob/trigger"

export function doWithItemOrElse(
  request: Request, item: Item, ifItem: (item: Item) => {}, ifNotItemMessage: string): Promise<any> {
  return new Promise((resolve) => {
    if (!item) {
      return resolve(new Response(request, ResponseStatus.ActionFailed, ifNotItemMessage))
    }

    return resolve(ifItem(item))
  })
}

export async function doSkill(request: Request, skillType: SkillType): Promise<Response> {
  const mob = request.player.sessionMob
  const skillModel = mob.skills.find((s) => s.skillType === skillType)
  const skillDefinition = skillCollection.find((skillDef) => skillDef.isSkillTypeMatch(skillType))
  const attempt = new Attempt(mob, skillModel, new AttemptContext(Trigger.Input, request.getTarget()))
  const responseBuilder = new ResponseBuilder(request)

  if (skillDefinition.preconditions) {
    const check = await skillDefinition.preconditions(attempt)
    if (check.checkResult === CheckResult.Unable) {
      return responseBuilder.error(check.message)
    }
    check.cost(request.player)
  }

  const outcome = await skillDefinition.action(attempt)

  if (outcome.wasSuccessful()) {
    return responseBuilder.success(outcome.getMessage())
  }

  return responseBuilder.fail(outcome.getMessage())
}
