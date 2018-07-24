import appetite from "../../mob/race/appetite"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { CheckStatus } from "../check"
import eat, { MESSAGE_FAIL_ALREADY_FULL, MESSAGE_FAIL_CANNOT_EAT_ITEM, MESSAGE_FAIL_NO_ITEM } from "./eat"

describe("eat action precondition", () => {
  it("should not allow eating food not in inventory", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    const food = testBuilder.withRoom().withFood()

    // when
    const check = await eat(new Request(player, RequestType.Eat, `eat ${food.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NO_ITEM)
  })

  it("should not allow eating items that are not food", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = testBuilder.withPlayer()
    const eq = playerBuilder.withTestEquipment()

    // when
    const check = await eat(new Request(playerBuilder.player, RequestType.Eat, `eat ${eq.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_CANNOT_EAT_ITEM)
  })

  it("should not allow eating when already full", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = testBuilder.withPlayer()
    const mob = playerBuilder.player.sessionMob
    mob.playerMob.hunger = appetite(mob.race)
    const food = playerBuilder.withFood()

    // when
    const check = await eat(new Request(playerBuilder.player, RequestType.Eat, `eat ${food.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_ALREADY_FULL)
  })

  it("should allow eating when all conditions are met", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = testBuilder.withPlayer()
    const food = playerBuilder.withFood()

    // when
    const check = await eat(new Request(playerBuilder.player, RequestType.Eat, `eat ${food.name}`))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(food)
  })
})
