import Check from "../../../check/check"
import {Item} from "../../../item/model/item"
import ItemService from "../../../item/service/itemService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {RequestType} from "../../../request/enum/requestType"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class InventoryAction extends Action {
  private static getItemName(mob: MobEntity, item: Item): string {
    if (item.affect().isInvisible() && !mob.affect().canDetectInvisible()) {
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

  public invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    const items = this.itemService.findAllByInventory(mob.inventory)
    return requestService.respondWith()
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
