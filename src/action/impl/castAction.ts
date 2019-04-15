import Check from "../../check/check"
import CheckBuilderFactory from "../../check/checkBuilderFactory"
import CheckedRequest from "../../check/checkedRequest"
import {CheckType} from "../../check/checkType"
import {Disposition} from "../../mob/enum/disposition"
import Request from "../../request/request"
import {RequestType} from "../../request/requestType"
import Response from "../../request/response"
import Action from "../action"
import {ConditionMessages, HelpMessages} from "../constants"
import {ActionPart} from "../enum/actionPart"
import Spell from "./spell"

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
    const spell = checkedRequest.check.result as Spell
    return spell.invoke(checkedRequest)
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Spell, ActionPart.Target ]
  }

  public getRequestType(): RequestType {
    return RequestType.Cast
  }

  public getHelpText(): string {
    return HelpMessages.Cast
  }
}
