import Spell from "../../action/spell"
import Check from "../../check/check"
import CheckBuilderFactory from "../../check/checkBuilderFactory"
import CheckedRequest from "../../check/checkedRequest"
import {CheckType} from "../../check/checkType"
import {Disposition} from "../../mob/enum/disposition"
import { Request } from "../../request/request"
import {RequestType} from "../../request/requestType"
import Response from "../../request/response"
import Action from "../action"
import {ConditionMessages} from "../constants"

export default class CastAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    private readonly spells: Spell[]) {
    super()
  }

  public async check(request: Request): Promise<Check> {
    const definition = this.spells.find(s => s.getSpellType().startsWith(request.getSubject()))
    const actionCheck = await this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .requireSubject(ConditionMessages.All.Arguments.Cast)
      .require(
        definition,
        ConditionMessages.Cast.NotASpell,
        CheckType.HasSpell)
      .capture(definition)
      .create()
    if (!actionCheck.isOk()) {
      return actionCheck
    }
    const spell = actionCheck.result as Spell
    return spell.check(request)
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const spell = checkedRequest.getCheckTypeResult(CheckType.HasSpell) as Spell
    return spell.invoke(checkedRequest)
  }

  protected getRequestType(): RequestType {
    return RequestType.Cast
  }
}
