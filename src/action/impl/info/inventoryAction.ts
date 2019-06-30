import Check from "../../../check/check"
import {ItemEntity} from "../../../item/entity/itemEntity"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {RequestType} from "../../../request/enum/requestType"
import Response from "../../../request/response"
import RequestService from "../../../request/service/requestService"
import {Messages} from "../../constants"
import {ActionPart} from "../../enum/actionPart"
import Action from "../action"

export default class InventoryAction extends Action {
  private static getItemName(mob: MobEntity, item: ItemEntity): string {
    if (item.affect().isInvisible() && !mob.affect().canDetectInvisible()) {
      return "(something)"
    }

    return item.brief
  }

  public check(): Promise<Check> {
    return Check.ok()
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    const items = mob.inventory.items
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
