import {ActionType} from "../action/enum/actionType"
import {AffectType} from "../affect/affectType"
import Check from "../check/check"
import CheckedRequest from "../check/checkedRequest"
import Cost from "../check/cost/cost"
import GameService from "../gameService/gameService"
import SpecializationLevel from "../mob/specialization/specializationLevel"
import {SpecializationType} from "../mob/specialization/specializationType"
import { Request } from "../request/request"
import Response from "../request/response"
import { SkillType } from "./skillType"

export default class Skill {
  constructor(
    private readonly service: GameService,
    public readonly skillType: SkillType,
    public readonly action:
      (checkedRequest: CheckedRequest, service: GameService) => Promise<Response>,
    public readonly preconditions:
      (request: Request, skillDefinition: Skill, service: GameService) => Promise<Check>,
    public readonly skillLevels: SpecializationLevel[],
    public readonly actionType: ActionType,
    public readonly costs: Cost[] = [],
    public readonly affect: AffectType = null) {}

  public async doAction(request: Request): Promise<Response> {
    if (!this.preconditions) {
      return this.action(new CheckedRequest(request, await Check.ok()), this.service)
    }

    const check = await this.preconditions(request, this, this.service)

    if (check.isOk()) {
      return this.action(new CheckedRequest(request, check), this.service)
    }

    return request.respondWith().error(check.result)
  }
}
