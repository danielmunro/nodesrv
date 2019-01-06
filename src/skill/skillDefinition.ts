import {ActionType} from "../action/actionType"
import Check from "../check/check"
import CheckedRequest from "../check/checkedRequest"
import Cost from "../check/cost/cost"
import GameService from "../gameService/gameService"
import SpecializationLevel from "../mob/specialization/specializationLevel"
import { Request } from "../request/request"
import Response from "../request/response"
import { SkillType } from "./skillType"

export default class SkillDefinition {
  constructor(
    private readonly service: GameService,
    public readonly skillType: SkillType,
    public readonly action: (checkedRequest: CheckedRequest, service: GameService) => Promise<Response>,
    public readonly preconditions: (request: Request, service: GameService) => Promise<Check>,
    public readonly skillLevels: SpecializationLevel[],
    public readonly actionType: ActionType,
    public readonly costs: Cost[] = []) {}

  public async doAction(request: Request) {
    if (!this.preconditions) {
      return this.action(new CheckedRequest(request, await Check.ok()), this.service)
    }

    const check = await this.preconditions(request, this.service)

    if (check.isOk()) {
      return this.action(new CheckedRequest(request, check), this.service)
    }

    return request.respondWith().error(check.result)
  }
}
