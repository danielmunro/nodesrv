import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { Equipment } from "../../item/equipment"
import { newEquipment } from "../../item/factory"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import getActionCollection from "../actionCollection"
import { Messages } from "../precondition/constants"

const itemName = "token"

function getItem() {
  return newEquipment("a token", "a small, round token", Equipment.Weapon)
}

describe("sacrifice action", () => {
  it("destroys the item", async () => {
    const item = getItem()
    item.value = 100
    const testBuilder = new TestBuilder()
    const mobBuilder = await testBuilder.withMob()
    testBuilder.room.inventory.addItem(item)

    const definition = getActionCollection(await testBuilder.getService())
      .getMatchingHandlerDefinitionForRequestType(RequestType.Sacrifice)

    const response = await definition.handle(
      testBuilder.createRequest(RequestType.Sacrifice, `sacrifice ${itemName}`, item))

    expect(response.responseAction.wasItemDestroyed()).toBeTruthy()
    expect(testBuilder.room.inventory.items).toHaveLength(0)
    expect(mobBuilder.mob.gold).toBeGreaterThan(0)
  })

  it("cannot sacrifice an item affected by NoSac", async () => {
    const item = getItem()
    item.affects.push(newAffect(AffectType.NoSacrifice))
    const testBuilder = new TestBuilder()
    testBuilder.withMob()
    testBuilder.room.inventory.addItem(item)

    const definition = getActionCollection(await testBuilder.getService())
      .getMatchingHandlerDefinitionForRequestType(RequestType.Sacrifice)

    const response = await definition.handle(
      testBuilder.createRequest(RequestType.Sacrifice, `sacrifice ${itemName}`, item))

    expect(response.responseAction.wasItemDestroyed()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.All.Item.CannotSacrifice)
    expect(testBuilder.room.inventory.items).toHaveLength(1)
  })
})
