import {CheckStatus} from "../../../check/checkStatus"
import {allDispositions, Disposition} from "../../../mob/enum/disposition"
import { RequestType } from "../../../request/requestType"
import { ResponseStatus } from "../../../request/responseStatus"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {ConditionMessages} from "../../constants"

let testBuilder: TestBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getAction(RequestType.Sell)
})

describe("sell action", () => {
  it("should be able to work successfully", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer()
    const item = testBuilder.withItem()
      .asHelmet()
      .addToPlayerBuilder(playerBuilder)
      .build()
    testBuilder.withMob().asMerchant()

    // and
    const mob = testBuilder.player.sessionMob
    const initialWorth = mob.gold

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Sell, "sell cap"))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(mob.gold).toBeGreaterThan(initialWorth)
    expect(mob.inventory.items).not.toContain(item)
  })

  it("should fail if a merchant is not in the room", async () => {
    // setup
    testBuilder.withRoom()
    await testBuilder.withPlayer()
    const request = testBuilder.createRequest(RequestType.Sell, "sell foo")

    // when
    const check = await action.check(request)

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(ConditionMessages.All.Item.NoMerchant)

    // and
    testBuilder.withMob()

    // when
    const check2 = await action.check(request)

    // then
    expect(check2.status).toBe(CheckStatus.Failed)
    expect(check2.result).toBe(ConditionMessages.All.Item.NoMerchant)
  })

  it("should fail if the seller does not have the item",  async () => {
    // given
    await testBuilder.withPlayer()
    testBuilder.withMob().asMerchant()

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Sell, "sell foo"))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(ConditionMessages.All.Item.NotOwned)
  })

  it("should succeed if all conditions met", async () => {
    // setup
    testBuilder.withRoom()
    const playerBuilder = await testBuilder.withPlayer()
    const item = testBuilder.withWeapon()
      .asAxe()
      .addToPlayerBuilder(playerBuilder)
      .build()
    testBuilder.withMob().asMerchant()

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Sell, `sell ${item.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(item)
  })

  it.each(allDispositions)("should require a standing disposition, provided with %s", async disposition => {
    // given
    testBuilder.withWeapon()
      .asAxe()
      .addToMobBuilder(testBuilder.withMob().withDisposition(disposition))
      .build()
    testBuilder.withMob().asMerchant()

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Sell, "sell axe"))

    // then
    expect(check.status).toBe(disposition === Disposition.Standing ? CheckStatus.Ok : CheckStatus.Failed)
  })
})
