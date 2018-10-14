import { CheckStatus } from "../../check/checkStatus"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE, Messages } from "./constants"
import get from "./get"

describe("get actions precondition", () => {
  it("should not work if the item specified does not exist", async () => {
    // given
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()

    // when
    const check = await get(testBuilder.createRequest(RequestType.Get, "get foo"), await testBuilder.getService())

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(Messages.All.Item.NotFound)
  })

  it("should be ok if the item is in the room's inventory", async () => {
    // given
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    const equipment = testBuilder.withRoom().withHelmetEq()

    // when
    const check = await get(testBuilder.createRequest(RequestType.Get, "get cap"), await testBuilder.getService())

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(equipment)
  })

  it("should be ok if the item is in a mob's container", async () => {
    // given
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()
    const container = mobBuilder.withSatchelContainer()
    const item = mobBuilder.withAxeEq()
    container.containerInventory.addItem(item)

    // when
    const check = await get(testBuilder.createRequest(RequestType.Get, "get axe sat"), await testBuilder.getService())

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(item)
  })

  it("should not be able to get an item that is not transferable", async () => {
    // setup
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    const item = testBuilder.withRoom().withHelmetEq()
    const service = await testBuilder.getService()
    item.isTransferable = false
    service.itemTable.add(item)

    // when
    const check = await get(
      testBuilder.createRequest(RequestType.Get, "get baseball"), service)

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE)
  })
})
