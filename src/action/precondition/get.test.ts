import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { CheckStatus } from "../check"
import drop, { MESSAGE_FAIL_NO_ITEM } from "./get"
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
    expect(check.result).toBe(MESSAGE_FAIL_NO_ITEM)
  })

  it("should be ok if the item is in the room's inventory", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer()
    const equipment = testBuilder.withRoom().withTestEquipment()

    // when
    const check = await drop(testBuilder.createRequest(RequestType.Drop, "drop cap"))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(equipment)
  })
})
