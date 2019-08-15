import {inject, injectable} from "inversify"
import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import ItemQuantity from "../../../item/interface/itemQuantity"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Request from "../../../messageExchange/request"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {Disposition} from "../../../mob/enum/disposition"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

@injectable()
export default class ListAction extends Action {
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .requireMerchant()
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const merchant = requestService.getResult<MobEntity>(CheckType.HasTarget)
    const itemQuantityMap = merchant.inventory.getItemQuantityMap()
    return requestService
      .respondWith()
      .success(Object.keys(itemQuantityMap).reduce((previousValue, currentValue) => {
        const itemQuantity: ItemQuantity = itemQuantityMap[currentValue]
        const item = itemQuantity.item
        return previousValue + "[ " + itemQuantity.quantity + " " + item.value + " ] " + item.brief + "\n"
      }, merchant.name + " has selling:\n[ quantity cost ]\n"))
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  /* istanbul ignore next */
  public getRequestType(): RequestType {
    return RequestType.List
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
