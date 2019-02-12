import Check from "../../../check/check"
import CheckBuilderFactory from "../../../check/checkBuilderFactory"
import CheckedRequest from "../../../check/checkedRequest"
import {CheckType} from "../../../check/checkType"
import ItemQuantity from "../../../item/itemQuantity"
import {Disposition} from "../../../mob/enum/disposition"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class ListAction extends Action {
  constructor(
    private readonly checkBuilderFactory: CheckBuilderFactory) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return this.checkBuilderFactory.createCheckBuilder(request, Disposition.Standing)
      .requireMerchant()
      .create()
  }

  public async invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const request = checkedRequest.request
    const merchant = checkedRequest.getCheckTypeResult(CheckType.HasTarget)
    const itemQuantityMap = merchant.inventory.getItemQuantityMap()
    return request
      .respondWith()
      .success(Object.keys(itemQuantityMap).reduce((previousValue, currentValue) => {
        const itemQuantity: ItemQuantity = itemQuantityMap[currentValue]
        const item = itemQuantity.item
        return previousValue + "[ " + itemQuantity.getQuantity() + " " + item.value + " ] " + item.brief + "\n"
      }, merchant.name + " is selling:\n[ quantity cost ]\n"))
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getRequestType(): RequestType {
    return RequestType.List
  }

  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
