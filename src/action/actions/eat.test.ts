import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import appetite from "../../mob/race/appetite"
import Table from "../../mob/table"
import RequestBuilder from "../../request/requestBuilder"
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
    const player = playerBuilder.player
    const requestBuilder = new RequestBuilder(player, new Table([player.sessionMob]))

    await eat(new CheckedRequest(
      requestBuilder.create(RequestType.Eat, `eat ${food.name}`),
      await Check.ok(food)))

    expect(playerBuilder.player.sessionMob.inventory.items.length).toBe(0)
    expect(playerBuilder.player.sessionMob.playerMob.hunger).toBe(food.nourishment)
  })

  it("should notify if the player is full", async () => {
    const testBuilder = new TestBuilder()
    const playerBuilder = testBuilder.withPlayer()
    const food = playerBuilder.withFood()
    const player = playerBuilder.player
    player.sessionMob.playerMob.hunger = appetite(player.sessionMob.race) - 1
    const requestBuilder = new RequestBuilder(player, new Table([player.sessionMob]))

    const response = await eat(new CheckedRequest(
      requestBuilder.create(RequestType.Eat, `eat ${food.name}`),
      await Check.ok(food)))

    expect(response.message).toContain("You feel full")
  })

  it ("should notify if the player receives an affect from eating", async () => {
    const testBuilder = new TestBuilder()
    const playerBuilder = testBuilder.withPlayer()
    const food = playerBuilder.withFood()
    food.affects.push(newAffect(AffectType.Poison))
    const player = playerBuilder.player
    const requestBuilder = new RequestBuilder(player)

    const response = await eat(new CheckedRequest(
      requestBuilder.create(RequestType.Eat, `eat ${food.name}`),
      await Check.ok(food)))

    expect(response.message).toContain("and suddenly feel different")
  })
})
