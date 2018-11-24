import Check from "../check/check"
import CheckedRequest from "../check/checkedRequest"
import GameService from "../gameService/gameService"
import { Trigger } from "../mob/enum/trigger"
import { Request } from "../request/request"
import Response from "../request/response"
import { SkillType } from "./skillType"

export default class SkillDefinition {
  constructor(
    private readonly service: GameService,
    public readonly skillType: SkillType,
    public readonly triggers: Trigger[],
    public readonly action: (checkedRequest: CheckedRequest, service: GameService) => Promise<Response>,
    public readonly preconditions: (request: Request, service: GameService) => Promise<Check> = null) {}

  public isSkillTypeMatch(skillType: SkillType) {
    return skillType === this.skillType
  }

  public async doAction(request: Request) {
    const check = await this.preconditions(request, this.service)

    if (check.isOk()) {
      return this.action(new CheckedRequest(request, check), this.service)
    }

    return request.respondWith().error(check.result)
  }
}
