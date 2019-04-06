import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import ItemService from "../../../item/itemService"
import {Item} from "../../../item/model/item"
import {Mob} from "../../../mob/model/mob"
import {RequestType} from "../../../request/requestType"
import Response from "../../../request/response"
import Action from "../../action"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"

export default class InventoryAction extends Action {
  private static getItemName(mob: Mob, item: Item): string {
    if (!item.isVisible() && !mob.affect().canDetectInvisible()) {
      return "(something)"
    }

    return item.name
  }

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
        items.reduce((previous, current) => previous + InventoryAction.getItemName(mob, current) + "\n", ""))
  }

  /* istanbul ignore next */
  public getActionParts(): ActionPart[] {
    return [ ActionPart.Action ]
  }

  public getRequestType(): RequestType {
    return RequestType.Inventory
  }

  /* istanbul ignore next */
  public getHelpText(): string {
    return Messages.Help.NoActionHelpTextProvided
  }
}
