import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import appetite from "../../mob/race/appetite"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import Check from "../check"
import CheckedRequest from "../checkedRequest"
import eat from "./eat"

describe("eat action", () => {
  it("should remove food from inventory when consumed", async () => {
    const testBuilder = new TestBuilder()
    const playerBuilder = testBuilder.withPlayer()
    const food = playerBuilder.withFood()

    await eat(new CheckedRequest(
      new Request(playerBuilder.player, RequestType.Eat, `eat ${food.name}`),
      await Check.ok(food)))

    expect(playerBuilder.player.sessionMob.inventory.items.length).toBe(0)
    expect(playerBuilder.player.sessionMob.playerMob.hunger).toBe(food.nourishment)
  })

  it("should notify if the player is full", async () => {
    const testBuilder = new TestBuilder()
    const playerBuilder = testBuilder.withPlayer()
    const food = playerBuilder.withFood()
    playerBuilder.player.sessionMob.playerMob.hunger = appetite(playerBuilder.player.sessionMob.race) - 1

    const response = await eat(new CheckedRequest(
      new Request(playerBuilder.player, RequestType.Eat, `eat ${food.name}`),
      await Check.ok(food)))

    expect(response.message).toContain("You feel full")
  })

  it ("should notify if the player receives an affect from eating", async () => {
    const testBuilder = new TestBuilder()
    const playerBuilder = testBuilder.withPlayer()
    const food = playerBuilder.withFood()
    food.affects.push(newAffect(AffectType.Poison))

    const response = await eat(new CheckedRequest(
      new Request(playerBuilder.player, RequestType.Eat, `eat ${food.name}`),
      await Check.ok(food)))

    expect(response.message).toContain("and suddenly feel different")
  })
})
