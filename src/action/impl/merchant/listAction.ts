import Check from "../../../check/check"
import {CheckType} from "../../../check/enum/checkType"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import ItemQuantity from "../../../item/itemQuantity"
import {Disposition} from "../../../mob/enum/disposition"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class ListAction extends Action {
  constructor(private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .requireMerchant()
      .create()
  }

  public async invoke(requestService: RequestService): Promise<Response> {
    const merchant = requestService.getResult(CheckType.HasTarget)
    const itemQuantityMap = merchant.inventory.getItemQuantityMap()
    return requestService
      .respondWith()
      .success(Object.keys(itemQuantityMap).reduce((previousValue, currentValue) => {
        const itemQuantity: ItemQuantity = itemQuantityMap[currentValue]
        const item = itemQuantity.item
        return previousValue + "[ " + itemQuantity.quantity + " " + item.value + " ] " + item.brief + "\n"
      }, merchant.name + " has selling:\n[ quantity cost ]\n"))
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  /* istanbul ignore next */
  public getRequestType(): RequestType {
    return RequestType.List
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
