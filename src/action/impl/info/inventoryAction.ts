import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import ItemService from "../../../item/itemService"
import {Item} from "../../../item/model/item"
import {Mob} from "../../../mob/model/mob"
import { Request } from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"

function getItemName(mob: Mob, item: Item): string {
  if (!item.isVisible() && !mob.canDetectInvisible()) {
    return "(something)"
  }

  return item.name
}

export default class InventoryAction extends Action {
  constructor(private readonly itemService: ItemService) {
    super()
  }

  public check(request: Request): Promise<Check> {
    return Check.ok()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const mob = checkedRequest.mob
    const items = this.itemService.findAllByInventory(mob.inventory)
    return checkedRequest.respondWith()
      .info("Your inventory:\n" +
        items.reduce((previous, current) => previous + getItemName(mob, current) + "\n", ""))
  }

  protected getRequestType(): RequestType {
    return RequestType.Inventory
  }
}
