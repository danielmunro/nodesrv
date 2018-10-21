import { ActionType } from "../action/actionType"
import { DamageType } from "../damage/damageType"
import { addFight, Fight, getFights } from "../mob/fight/fight"
import Check from "../check/check"
import { SpellType } from "./spellType"
import { Request } from "../request/request"
import CheckedRequest from "../check/checkedRequest"
import Response from "../request/response"

export default class SpellDefinition {
  constructor(
    public readonly spellType: SpellType,
    public readonly actionType: ActionType,
    public readonly preconditions: (request: Request) => Promise<Check>,
    public readonly action: (checkedRequest: CheckedRequest) => Promise<Response>,
    public readonly damageType: DamageType = null,
  ) {}

  public async doAction(request: Request) {
    const check = await this.preconditions(request)

    if (check.isOk()) {
      return this.action(new CheckedRequest(request, check))
    }

    return request.respondWith().error(check.result)
  }
}
