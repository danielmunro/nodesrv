import Check from "../../check/check"
import CheckBuilderFactory from "../../check/checkBuilderFactory"
import CheckedRequest from "../../check/checkedRequest"
import {CheckType} from "../../check/checkType"
import GameService from "../../gameService/gameService"
import {Disposition} from "../../mob/enum/disposition"
import { Request } from "../../request/request"
import {RequestType} from "../../request/requestType"
import Response from "../../request/response"
import Spell from "../../spell/spell"
import Action from "../action"
import {Messages as ActionMessages} from "../constants"
import {ConditionMessages} from "../constants"

export default class CastAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly gameService: GameService,
    private readonly spells: Spell[]) {
    super()
  }

  public async check(request: Request): Promise<Check> {
    const actionCheck = await this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .requireSubject(ConditionMessages.All.Arguments.Cast)
      .require(this.spells.find(s =>
        s.spellType.startsWith(request.getSubject())), ConditionMessages.Cast.NotASpell, CheckType.HasSpell)
      .capture()
      .create()
    if (!actionCheck.isOk()) {
      return actionCheck
    }
    const spell = actionCheck.result
    return spell.preconditions(request, spell, this.gameService)
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const spellDefinition = checkedRequest.getCheckTypeResult(CheckType.HasSpell)
    await spellDefinition.doAction(checkedRequest.request)
    return checkedRequest.respondWith().success(
      ActionMessages.Cast.Success,
      { verb: "utter", spell: spellDefinition.spellType },
      { verb: "utters", spell: spellDefinition.spellType })
  }

  protected getRequestType(): RequestType {
    return RequestType.Cast
  }
}
