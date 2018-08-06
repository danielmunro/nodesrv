import { Equipment } from "../../item/equipment"
import { newEquipment } from "../../item/factory"
import { Item } from "../../item/model/item"
import { Player } from "../../player/model/player"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import { getTestPlayer } from "../../test/player"
import Check from "../check"
import CheckedRequest from "../checkedRequest"
import wear from "./wear"

function getHatOfMight(): Item {
  return newEquipment("the hat of might", "a mighty hat", Equipment.Head)
}

function getPirateHat(): Item {
  return newEquipment("a pirate hat", "a well-worn pirate hat", Equipment.Head)
}

async function useWearRequest(input: string, player: Player, item: Item) {
  return wear(new CheckedRequest(
    new Request(player, RequestType.Wear, input),
    await Check.ok(item)))
}

describe("wear", () => {
  it("can equip an item", async () => {
    // given
    const player = getTestPlayer()
    const item = getHatOfMight()
    player.sessionMob.inventory.addItem(item)

    // when
    const response = await useWearRequest("wear hat", player, item)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message).toBe("You wear the hat of might.")
  })

  it("will remove an equipped item and wear a new item", async () => {
    // given
    const player = getTestPlayer()
    const inventory = player.sessionMob.inventory
    const item1 = getPirateHat()
    const item2 = getHatOfMight()
    inventory.addItem(item1)
    inventory.addItem(item2)
    await useWearRequest("wear pirate", player, item1)

    // when
    const response = await useWearRequest("wear might", player, item2)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message).toBe("You remove a pirate hat and wear the hat of might.")
  })
})
