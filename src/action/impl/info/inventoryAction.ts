import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import ItemService from "../../../item/itemService"
import {Item} from "../../../item/model/item"
import {Mob} from "../../../mob/model/mob"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {ActionPart} from "../../enum/actionPart"

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

  public check(): Promise<Check> {
    return Check.ok()
  }

  public invoke(checkedRequest: CheckedRequest): Promise<Response> {
    const mob = checkedRequest.mob
    const items = this.itemService.findAllByInventory(mob.inventory)
    return checkedRequest.respondWith()
      .info("Your inventory:\n" +
        items.reduce((previous, current) => previous + getItemName(mob, current) + "\n", ""))
  }

  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getRequestType(): RequestType {
    return RequestType.Inventory
  }
}
