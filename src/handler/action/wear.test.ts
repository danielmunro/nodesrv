import { Equipment } from "../../item/equipment"
import { Item } from "../../item/model/item"
import { Player } from "../../player/model/player"
import { createRequestArgs, Request } from "../../request/request"
import { getTestPlayer } from "../../test/player"
import { RequestType } from "../constants"
import wear, { ITEM_NOT_FOUND } from "./wear"

function getHatOfMight(): Item {
  const item = new Item()
  item.equipment = Equipment.Head
  item.name = "the hat of might"

  return item
}

function getPirateHat(): Item {
  const item = new Item()
  item.equipment = Equipment.Head
  item.name = "a well-worn pirate hat"

  return item
}

function useWearRequest(input: string, player: Player = getTestPlayer()) {
  return wear(new Request(player, RequestType.Wear, createRequestArgs(input)))
}

describe("wear", () => {
  it("should not work if an item is not found", async () => {
    expect.assertions(1)
    await useWearRequest("wear foo")
      .then((response) => expect(response.message).toBe(ITEM_NOT_FOUND))
  })

  it("can equip an item", async () => {
    const player = getTestPlayer()
    player.sessionMob.inventory.addItem(getHatOfMight())
    expect.assertions(1)

    await useWearRequest("wear hat", player)
      .then((response) => expect(response.message).toBe("You wear the hat of might."))
  })

  it("will remove an equipped item and wear a new item", async () => {
    const player = getTestPlayer()
    const inventory = player.sessionMob.inventory
    inventory.addItem(getHatOfMight())
    inventory.addItem(getPirateHat())
    expect.assertions(1)

    await useWearRequest("wear pirate", player)
      .then(() => useWearRequest("wear might", player)
      .then((response) =>
        expect(response.message).toBe("You remove a well-worn pirate hat and wear the hat of might.")))
  })
})
