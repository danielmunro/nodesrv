import CheckedRequest from "../../check/checkedRequest"
import {CheckType} from "../../check/checkType"
import ItemQuantity from "../../item/itemQuantity"
import Response from "../../request/response"

export default async function(checkedRequest: CheckedRequest): Promise<Response> {
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
