import {CheckStatus} from "../../../check/checkStatus"
import { Equipment } from "../../../item/equipment"
import { newEquipment } from "../../../item/factory"
import { Item } from "../../../item/model/item"
import { RequestType } from "../../../request/requestType"
import { ResponseStatus } from "../../../request/responseStatus"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {ConditionMessages} from "../../constants"

function getHatOfMight(): Item {
  return newEquipment("the hat of might", "a mighty hat", Equipment.Head)
}

function getPirateHat(): Item {
  return newEquipment("a pirate hat", "a well-worn pirate hat", Equipment.Head)
}

let testBuilder: TestBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getActionDefinition(RequestType.Wear)
})

describe("wear", () => {
  it("can equip an item", async () => {
    // given
    await testBuilder.withPlayer(p => p.sessionMob.inventory.addItem(getHatOfMight()))

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Wear, "wear hat"))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message.getMessageToRequestCreator()).toBe("You wear the hat of might.")
  })

  it("will remove an equipped item and wear a new item", async () => {
    // given
    await testBuilder.withPlayer(p => {
      p.sessionMob.inventory.addItem(getHatOfMight())
      p.sessionMob.equipped.addItem(getPirateHat())
    })

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Wear, "wear hat"))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message.getMessageToRequestCreator()).toBe("You remove a pirate hat and wear the hat of might.")
  })

  it("should not work if an item is not found", async () => {
    // when
    await testBuilder.withPlayer()
    const check = await action.check(testBuilder.createRequest(RequestType.Wear, "wear foo"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(ConditionMessages.All.Item.NotOwned)
  })

  it("can equip an item", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withAxeEq()

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Wear, "wear axe"))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).not.toBeNull()
  })

  it("can't equip things that aren't equipment", async () => {
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withFood()

    const check = await action.check(
      testBuilder.createRequest(
        RequestType.Wear,
        "wear muffin"))

    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(ConditionMessages.All.Item.NotEquipment)
  })
})
