import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { CheckStatus } from "../check/checkStatus"
import { MESSAGE_FAIL_ITEM_NOT_IN_ROOM, MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE } from "./constants"
import drop from "./get"
import get from "./get"

describe("get actions precondition", () => {
  it("should not work if the item is not in the right inventory", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer()

    // when
    const check = await get(testBuilder.createRequest(RequestType.Get, "get foo"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_ITEM_NOT_IN_ROOM)
  })

  it("should be ok if the item is in the room's inventory", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer()
    const equipment = testBuilder.withRoom().withHelmetEq()

    // when
    const check = await drop(testBuilder.createRequest(RequestType.Drop, "drop cap"))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(equipment)
  })

  it("should not be able to get an item that is not transferable", async () => {
    // setup
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer()
    const item = testBuilder.withRoom().withHelmetEq()
    item.isTransferable = false

    // when
    const check = await get(testBuilder.createRequest(RequestType.Get, `get ${item.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE)
  })
})
