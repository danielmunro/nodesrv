import {inject, injectable, multiInject} from "inversify"
import Check from "../../check/check"
import {CheckType} from "../../check/enum/checkType"
import CheckBuilderFactory from "../../check/factory/checkBuilderFactory"
import {Disposition} from "../../mob/enum/disposition"
import {RequestType} from "../../request/enum/requestType"
import Request from "../../request/request"
import Response from "../../request/response"
import RequestService from "../../request/service/requestService"
import {Types} from "../../support/types"
import {ConditionMessages, HelpMessages} from "../constants"
import {ActionPart} from "../enum/actionPart"
import Action from "./action"
import Spell from "./spell"

@injectable()
export default class CastAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @multiInject(Types.Spells) private readonly spells: Spell[]) {
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

  public async invoke(requestService: RequestService): Promise<Response> {
    const spell = requestService.getResult<Spell>()
    return spell.invoke(requestService)
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
