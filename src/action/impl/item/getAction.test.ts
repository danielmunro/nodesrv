import {CheckStatus} from "../../../check/checkStatus"
import {newFood} from "../../../item/factory"
import { RequestType } from "../../../request/requestType"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {ConditionMessages} from "../../constants"
import {MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE} from "../../constants"

let testBuilder: TestBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getActionDefinition(RequestType.Get)
})

describe("get action", () => {
  it("should be able to get an item from a room inventory", async () => {
    // setup
    testBuilder.withRoom().withHelmetEq()
    const playerBuilder = await testBuilder.withPlayer()
    const player = playerBuilder.player
    const itemCount = player.sessionMob.inventory.items.length
    player.sessionMob.name = "alice"

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Get, "get cap"))

    // then
    expect(player.sessionMob.inventory.items.length).toBe(itemCount + 1)
    expect(response.message.getMessageToRequestCreator()).toContain("you pick up a baseball cap")
    expect(response.message.getMessageToObservers()).toContain("alice picks up a baseball cap")
  })

  it("should be able to get an item from a container", async () => {
    // setup
    testBuilder.withRoom()
    const playerBuilder = await testBuilder.withPlayer()
    const satchel = playerBuilder.withSatchelEq()
    const item = newFood("a pretzel", "a pretzel")
    satchel.container.addItem(item)
    const service = await testBuilder.getService()
    service.itemService.add(item)

    const definition = await testBuilder.getActionDefinition(RequestType.Get)

    const player = playerBuilder.player
    const itemCount = player.sessionMob.inventory.items.length
    player.sessionMob.name = "alice"

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Get, "get pretzel satchel"))

    // then
    expect(player.sessionMob.inventory.items.length).toBe(itemCount + 1)
    expect(response.message.getMessageToRequestCreator())
      .toContain("you get a pretzel from a small leather satchel")
    expect(response.message.getMessageToObservers())
      .toContain("alice gets a pretzel from a small leather satchel")
  })

  it("should not work if the item specified does not exist", async () => {
    // given
    testBuilder.withRoom()
    await testBuilder.withPlayer()

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Get, "get foo"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(ConditionMessages.All.Item.NotFound)
  })

  it("should be ok if the item is in the room's inventory", async () => {
    // given
    await testBuilder.withPlayer()
    const equipment = testBuilder.withRoom().withHelmetEq()

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Get, "get cap"))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(equipment)
  })

  it("should be ok if the item is in a mob's container", async () => {
    // given
    const mobBuilder = testBuilder.withMob()
    const container = mobBuilder.withSatchelContainer()
    const item = mobBuilder.withAxeEq()
    container.container.addItem(item)

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Get, "get axe sat"))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(item)
  })

  it("should not be able to get an item that is not transferable", async () => {
    // setup
    await testBuilder.withPlayer()
    const item = testBuilder.withRoom().withHelmetEq()
    const service = await testBuilder.getService()
    item.isTransferable = false
    service.itemService.add(item)

    // when
    const check = await action.check(
      testBuilder.createRequest(RequestType.Get, "get baseball"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE)
  })
})
