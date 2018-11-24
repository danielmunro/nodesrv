import { ActionType } from "../action/actionType"
import Check from "../check/check"
import CheckedRequest from "../check/checkedRequest"
import { DamageType } from "../damage/damageType"
import GameService from "../gameService/gameService"
import { Request } from "../request/request"
import Response from "../request/response"
import { SpellType } from "./spellType"

export default class SpellDefinition {
  constructor(
    private readonly service: GameService,
    public readonly spellType: SpellType,
    public readonly actionType: ActionType,
    public readonly preconditions: (request: Request, service: GameService) => Promise<Check>,
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
