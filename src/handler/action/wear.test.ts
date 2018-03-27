import { Equipment } from "../../item/equipment"
import { Item } from "../../item/model/item"
import { Request } from "../../server/request/request"
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

describe("wear", () => {
  it("should not work if an item is not found", () => {
    expect.assertions(1)
    return wear(new Request(getTestPlayer(), RequestType.Wear, {request: "wear foo"}))
      .then((response) => expect(response.message).toBe(ITEM_NOT_FOUND))
  })

  it("can equip an item", () => {
    const player = getTestPlayer()
    player.sessionMob.inventory.addItem(getHatOfMight())
    expect.assertions(1)
    return wear(new Request(player, RequestType.Wear, {request: "wear hat"}))
      .then((response) => expect(response.message).toBe("You wear the hat of might."))
  })

  it("will remove an equipped item and wear a new item", () => {
    const player = getTestPlayer()
    player.sessionMob.inventory.addItem(getHatOfMight())
    player.sessionMob.inventory.addItem(getPirateHat())
    expect.assertions(1)
    return wear(new Request(player, RequestType.Wear, {request: "wear pirate"}))
      .then(() => wear(new Request(player, RequestType.Wear, {request: "wear might"}))
      .then((response) =>
        expect(response.message).toBe("You remove a well-worn pirate hat and wear the hat of might.")))
  })
})
