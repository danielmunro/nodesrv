import CheckedRequest from "../../check/checkedRequest"
import { Equipment } from "../../item/equipment"
import { newEquipment } from "../../item/factory"
import { Item } from "../../item/model/item"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import wearPrecondition from "../precondition/wear"
import wear from "./wear"

function getHatOfMight(): Item {
  return newEquipment("the hat of might", "a mighty hat", Equipment.Head)
}

function getPirateHat(): Item {
  return newEquipment("a pirate hat", "a well-worn pirate hat", Equipment.Head)
}

describe("wear", () => {
  it("can equip an item", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    await testBuilder.withPlayer(p => p.sessionMob.inventory.addItem(getHatOfMight()))

    // when
    const request = testBuilder.createRequest(RequestType.Wear, "wear hat")
    const check = await wearPrecondition(request)
    const response = await wear(new CheckedRequest(request, check))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message.getMessageToRequestCreator()).toBe("You wear the hat of might.")
  })

  it("will remove an equipped item and wear a new item", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    await testBuilder.withPlayer(p => {
      p.sessionMob.inventory.addItem(getHatOfMight())
      p.sessionMob.equipped.addItem(getPirateHat())
    })

    // when
    const request = testBuilder.createRequest(RequestType.Wear, "wear hat")
    const check = await wearPrecondition(request)
    const response = await wear(new CheckedRequest(request, check))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message.getMessageToRequestCreator()).toBe("You remove a pirate hat and wear the hat of might.")
  })
})
