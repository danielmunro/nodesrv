import { CheckStatus } from "../../check/checkStatus"
import { allDispositions, Disposition } from "../../mob/enum/disposition"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { Messages } from "./constants"
import wear from "./wear"

describe("wear", () => {
  it("should not work if an item is not found", async () => {
    // when
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    const check = await wear(testBuilder.createRequest(RequestType.Wear, "wear foo"), await testBuilder.getService())

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(Messages.All.Item.NotOwned)
  })

  it("can equip an item", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withAxeEq()

    // when
    const check = await wear(testBuilder.createRequest(RequestType.Wear, "wear axe"), await testBuilder.getService())

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).not.toBeNull()
  })

  it("can't equip things that aren't equipment", async () => {
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withFood()

    const check = await wear(
      testBuilder.createRequest(
        RequestType.Wear,
        "wear muffin",
        playerBuilder.player.sessionMob),
      await testBuilder.getService())

    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(Messages.All.Item.NotEquipment)
  })

  it("can't equip if not standing", () => {
    allDispositions.forEach(async disposition => {
      const testBuilder = new TestBuilder()
      const playerBuilder = await testBuilder.withPlayer()
      playerBuilder.withAxeEq()
      const player = playerBuilder.player
      player.sessionMob.disposition = disposition
      const check = await wear(
        testBuilder.createRequest(RequestType.Wear, "wear axe", player.sessionMob),
        await testBuilder.getService())
      expect(check.status).toBe(disposition === Disposition.Standing ? CheckStatus.Ok : CheckStatus.Failed)
    })
  })
})
