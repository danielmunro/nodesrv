import {inject, injectable} from "inversify"
import Check from "../../../../check/check"
import {CheckType} from "../../../../check/enum/checkType"
import CheckBuilderFactory from "../../../../check/factory/checkBuilderFactory"
import {RequestType} from "../../../../messageExchange/enum/requestType"
import Request from "../../../../messageExchange/request"
import Response from "../../../../messageExchange/response"
import RequestService from "../../../../messageExchange/service/requestService"
import MobService from "../../../../mob/service/mobService"
import {Types} from "../../../../support/types"
import {Messages} from "../../../constants"
import {ActionPart} from "../../../enum/actionPart"
import Action from "../../action"

@injectable()
export default class AliasRemoveAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.MobService) private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(this.getActionParts())
      .require(
        request.mob.playerMob.aliases.find(a => a.alias === request.getComponent()),
        Messages.Alias.AliasDoesNotExist)
      .create()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Directive, ActionPart.Name ]
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.AliasRemove
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    const alias = requestService.getResult<string>(CheckType.Name)
    mob.playerMob.aliases = mob.playerMob.aliases.filter(a => a.alias !== alias)
    await this.mobService.save(mob)
    return requestService.respondWith().success(`alias '${alias}' removed`)
  }
}
