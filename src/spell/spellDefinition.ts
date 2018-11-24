import { ActionType } from "../action/actionType"
import Check from "../check/check"
import CheckedRequest from "../check/checkedRequest"
import { DamageType } from "../damage/damageType"
import { Request } from "../request/request"
import Response from "../request/response"
import Service from "../service/service"
import { SpellType } from "./spellType"

export default class SpellDefinition {
  constructor(
    private readonly service: Service,
    public readonly spellType: SpellType,
    public readonly actionType: ActionType,
    public readonly preconditions: (request: Request, service: Service) => Promise<Check>,
    public readonly action: (checkedRequest: CheckedRequest) => Promise<Response>,
    public readonly damageType: DamageType = null,
  ) {}

  public async doAction(request: Request) {
    const check = await this.preconditions(request, this.service)

    if (check.isOk()) {
      return this.action(new CheckedRequest(request, check))
    }

    return request.respondWith().error(check.result)
  }
}
