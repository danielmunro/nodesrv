import { unmanaged } from "inversify"
import Check from "../../check/check"
import CheckBuilderFactory from "../../check/factory/checkBuilderFactory"
import {RequestType} from "../../messageExchange/enum/requestType"
import Request from "../../messageExchange/request"
import {ActionPart} from "../enum/actionPart"
import Action from "./action"
import {Messages} from "../constants"

export default abstract class SimpleAction extends Action {
  protected constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory,
    @unmanaged() private readonly requestType: RequestType,
    @unmanaged() private readonly helpText: string = Messages.Help.NoActionHelpTextProvided) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request).create()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getHelpText(): string {
    return this.helpText
  }

  public getRequestType(): RequestType {
    return this.requestType
  }
}
