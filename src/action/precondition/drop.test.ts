import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { CheckStatus } from "../../check/checkStatus"
import { MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE } from "./constants"
import { MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY } from "./constants"
import drop from "./drop"

describe("drop actions precondition", () => {
  it("should not work if the item is not in the right inventory", async () => {
    // given
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()

    // when
    const check = await drop(testBuilder.createRequest(RequestType.Drop, "drop foo"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_ITEM_NOT_IN_INVENTORY)
  })

  it("should be ok if the item is in the mob's inventory", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const equipment = playerBuilder.withHelmetEq()

    // when
    const check = await drop(testBuilder.createRequest(RequestType.Drop, "drop cap"))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(equipment)
  })

  it("should fail if the item is cursed", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const equipment = playerBuilder.withHelmetEq()
    equipment.affects.push(newAffect(AffectType.Curse))

    // when
    const check = await drop(testBuilder.createRequest(RequestType.Drop, "drop cap"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toContain("curse")
  })

  it("should not be able to drop an item that is not transferable", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const item = playerBuilder.withHelmetEq()
    testBuilder.withRoom()
    item.isTransferable = false

    // when
    const check = await drop(testBuilder.createRequest(RequestType.Drop, `drop ${item.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE)
  })
})
