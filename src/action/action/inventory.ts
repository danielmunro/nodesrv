import GameService from "../../gameService/gameService"
import { Item } from "../../item/model/item"
import { Mob } from "../../mob/model/mob"
import { Request } from "../../request/request"
import Response from "../../request/response"

export default function(request: Request, service: GameService): Promise<Response> {
  const items = service.itemTable.findByInventory(request.mob.inventory)
  return request.respondWith()
    .info("Your inventory:\n" +
        items.reduce((previous, current) => previous + getItemName(request.mob, current) + "\n", ""))
}

function getItemName(mob: Mob, item: Item): string {
  if (!item.isVisible() && !mob.canDetectInvisible()) {
    return "(something)"
  }

  return item.name
}
