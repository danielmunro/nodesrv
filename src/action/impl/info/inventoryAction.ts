import {inject, injectable} from "inversify"
import CheckBuilderFactory from "../../../check/factory/checkBuilderFactory"
import {ItemEntity} from "../../../item/entity/itemEntity"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Response from "../../../messageExchange/response"
import RequestService from "../../../messageExchange/service/requestService"
import {MobEntity} from "../../../mob/entity/mobEntity"
import {Types} from "../../../support/types"
import SimpleAction from "../simpleAction"

@injectable()
export default class InventoryAction extends SimpleAction {
  private static getItemName(mob: MobEntity, item: ItemEntity): string {
    if (item.affect().isInvisible() && !mob.affect().canDetectInvisible()) {
      return "(something)"
    }

    return item.brief
  }

  constructor(@inject(Types.CheckBuilderFactory) checkBuilderFactory: CheckBuilderFactory) {
    super(checkBuilderFactory, RequestType.Inventory)
  }

  public invoke(requestService: RequestService): Promise<Response> {
    const mob = requestService.getMob()
    const items = mob.inventory.items
    return requestService.respondWith()
      .info("Your inventory:\n" +
        items.reduce((previous, current) => previous + InventoryAction.getItemName(mob, current) + "\n", ""))
  }
}
