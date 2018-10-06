import Maybe from "../functional/maybe"
import { Item } from "../item/model/item"
import { Request } from "../request/request"
import Response from "../request/response"
import { ResponseStatus } from "../request/responseStatus"

export function doWithItemOrElse(
  request: Request, item: Item, ifItem: (item: Item) => {}, ifNotItemMessage: string): Promise<any> {
  return new Maybe(item)
    .do(i => ifItem(i))
    .or(() => new Response(request, ResponseStatus.ActionFailed, ifNotItemMessage))
    .get()
}
