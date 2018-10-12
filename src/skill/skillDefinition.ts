import Check from "../check/check"
import CheckedRequest from "../check/checkedRequest"
import { Trigger } from "../mob/trigger"
import { Request } from "../request/request"
import Response from "../request/response"
import { SkillType } from "./skillType"

export default class SkillDefinition {
  constructor(
    public readonly skillType: SkillType,
    public readonly triggers: Trigger[],
    public readonly action: (checkedRequest: CheckedRequest) => Promise<Response>,
    public readonly preconditions: (request: Request) => Promise<Check> = null) {}

  public isSkillTypeMatch(skillType: SkillType) {
    return skillType === this.skillType
  }

  public async doAction(request: Request) {
    const check = await this.preconditions(request)

    if (check.isOk()) {
      return this.action(new CheckedRequest(request, check))
    }

    return request.respondWith().error(check.result)
  }
}
