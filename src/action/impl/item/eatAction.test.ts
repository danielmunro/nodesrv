import { AffectType } from "../../../affect/affectType"
import { newAffect } from "../../../affect/factory"
import appetite from "../../../mob/race/appetite"
import { RequestType } from "../../../request/requestType"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {ConditionMessages} from "../../constants"

let testBuilder: TestBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getActionDefinition(RequestType.Eat)
})

describe("eat action", () => {
  it("should remove food from inventory when consumed", async () => {
    const playerBuilder = await testBuilder.withPlayer()
    const food = playerBuilder.withFood()
    const player = playerBuilder.player

    await action.handle(testBuilder.createRequest(RequestType.Eat, `eat muf`))

    expect(player.sessionMob.inventory.items.length).toBe(0)
    expect(player.sessionMob.playerMob.hunger).toBe(food.hunger)
  })

  it("should notify if the player is full", async () => {
    const playerBuilder = await testBuilder.withPlayer()
    const food = playerBuilder.withFood()
    const player = playerBuilder.player
    player.sessionMob.playerMob.hunger = appetite(player.sessionMob.race) - 1

    const response = await action.handle(testBuilder.createRequest(RequestType.Eat, `eat muffin`, food))

    expect(response.message.getMessageToRequestCreator()).toContain("You feel full")
  })

  it ("should notify if the player receives an affect from eating", async () => {
    const playerBuilder = await testBuilder.withPlayer()
    const food = playerBuilder.withFood()
    food.affects.push(newAffect(AffectType.Poison))

    const response = await action.handle(testBuilder.createRequest(RequestType.Eat, `eat muffin`))

    expect(response.message.getMessageToRequestCreator()).toContain("and suddenly feel different")
  })

  it("should not allow eating food not in inventory", async () => {
    // given
    await testBuilder.withPlayer()
    const food = testBuilder.withRoom().withFood()

    // when
    const response = await action.handle(
      testBuilder.createRequest(RequestType.Eat, `eat ${food.name}`))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.All.Item.NotOwned)
  })

  it("should not allow eating items that are not food", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer()
    const eq = playerBuilder.withHelmetEq()

    // when
    const response = await action.handle(
      testBuilder.createRequest(RequestType.Eat, `eat ${eq.name}`))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.Eat.NotFood)
  })

  it("should not allow eating when already full", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer()
    const mob = playerBuilder.player.sessionMob
    mob.playerMob.hunger = appetite(mob.race)
    const food = playerBuilder.withFood()

    // when
    const response = await action.handle(
      testBuilder.createRequest(RequestType.Eat, `eat ${food.name}`))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.Eat.AlreadyFull)
  })

  it("should allow eating when all conditions are met", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer()
    const food = playerBuilder.withFood()

    // when
    const response = await action.handle(
      testBuilder.createRequest(RequestType.Eat, `eat ${food.name}`))

    // then
    expect(response.isSuccessful()).toBeTruthy()
  })
})
