import {inject, injectable} from "inversify"
import Check from "../../../../check/check"
import CheckBuilderFactory from "../../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import Request from "../../../../messageExchange/request"
import Response from "../../../../messageExchange/response"
import RequestService from "../../../../messageExchange/service/requestService"
import {Types} from "../../../../support/types"
import {Messages} from "../../../constants"
import {ActionPart} from "../../../enum/actionPart"
import Alias from "../../../type/alias"
import Action from "../../action"

@injectable()
export default class AliasListAction extends Action {
  constructor(@inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(request, this.getActionParts()).create()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Directive ]
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.AliasList
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    return requestService.respondWith().success(
      "Your aliases:" + requestService.getMob().playerMob.aliases.reduce(
        (previous: string, current: Alias) =>
          previous + "\n" + current.alias + ": " + current.command, ""))
  }
}
