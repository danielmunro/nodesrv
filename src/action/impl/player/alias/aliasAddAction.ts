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

export const maxAliases = 10

@injectable()
export default class AliasAddAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.MobService) private readonly mobService: MobService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request)
      .requireFromActionParts(request, this.getActionParts())
      .not().require(request.mob.playerMob.getAliasCommand(request.getComponent()), Messages.Alias.AliasAlreadySet)
      .require(request.mob.playerMob.aliases.length <= maxAliases, Messages.Alias.TooManyAliases)
      .create()
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action, ActionPart.Directive, ActionPart.Name, ActionPart.FreeForm ]
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }

  public getRequestType(): RequestType {
    return RequestType.AliasAdd
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    const alias = requestService.getResult<string>(CheckType.Name)
    const command = requestService.getResult<string>(CheckType.FreeForm)
    mob.playerMob.aliases.push({ alias, command })
    await this.mobService.save(mob)
    return requestService.respondWith().success(`alias '${alias}' added`)
  }
}
