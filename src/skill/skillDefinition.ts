import Check from "../check/check"
import CheckedRequest from "../check/checkedRequest"
import { Trigger } from "../mob/enum/trigger"
import { Request } from "../request/request"
import Response from "../request/response"
import Service from "../service/service"
import { SkillType } from "./skillType"

export default class SkillDefinition {
  constructor(
    private readonly service: Service,
    public readonly skillType: SkillType,
    public readonly triggers: Trigger[],
    public readonly action: (checkedRequest: CheckedRequest, service: Service) => Promise<Response>,
    public readonly preconditions: (request: Request, service: Service) => Promise<Check> = null) {}

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
