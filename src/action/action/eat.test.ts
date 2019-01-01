import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import appetite from "../../mob/race/appetite"
import InputContext from "../../request/context/inputContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import eat from "./eat"

describe("eat action", () => {
  it("should remove food from inventory when consumed", async () => {
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const food = playerBuilder.withFood()
    const player = playerBuilder.player

    await eat(new CheckedRequest(
      new Request(player.sessionMob, testBuilder.room, new InputContext(RequestType.Eat, `eat muf`)),
      await Check.ok(food)),
      await testBuilder.getService())

    expect(player.sessionMob.inventory.items.length).toBe(0)
    expect(player.sessionMob.playerMob.hunger).toBe(food.hunger)
  })

  it("should notify if the player is full", async () => {
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const food = playerBuilder.withFood()
    const player = playerBuilder.player
    player.sessionMob.playerMob.hunger = appetite(player.sessionMob.race) - 1

    const response = await eat(new CheckedRequest(
      testBuilder.createRequest(RequestType.Eat, `eat muffin`), await Check.ok(food)),
      await testBuilder.getService())

    expect(response.message.getMessageToRequestCreator()).toContain("You feel full")
  })

  it ("should notify if the player receives an affect from eating", async () => {
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const food = playerBuilder.withFood()
    food.affects.push(newAffect(AffectType.Poison))

    const response = await eat(new CheckedRequest(
      testBuilder.createRequest(RequestType.Eat, `eat muffin`),
      await Check.ok(food)),
      await testBuilder.getService())

    expect(response.message.getMessageToRequestCreator()).toContain("and suddenly feel different")
  })
})
