import { AffectType } from "../../../affect/affectType"
import appetite from "../../../mob/race/appetite"
import { RequestType } from "../../../request/requestType"
import PlayerBuilder from "../../../test/playerBuilder"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {ConditionMessages} from "../../constants"

let testBuilder: TestBuilder
let playerBuilder: PlayerBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getAction(RequestType.Eat)
  playerBuilder = await testBuilder.withPlayer()
})

describe("eat action", () => {
  it("should remove food from inventory when consumed", async () => {
    // given
    const food = testBuilder.withItem()
      .asFood()
      .addToPlayerBuilder(playerBuilder)
      .build()

    // when
    await action.handle(testBuilder.createRequest(RequestType.Eat, `eat ${food.name}`))

    // then
    const mob = playerBuilder.getMob()
    expect(mob.inventory.items.length).toBe(0)
    expect(mob.playerMob.hunger).toBe(food.hunger)
  })

  it("should notify if the player is full", async () => {
    // given
    const food = testBuilder.withItem()
      .asFood()
      .addToPlayerBuilder(playerBuilder)
      .build()
    const mob = playerBuilder.getMob()
    mob.playerMob.hunger = appetite(mob.race) - 1

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Eat, `eat ${food.name}`))

    // then
    expect(response.message.getMessageToRequestCreator()).toContain("You feel full")
  })

  it ("should notify if the player receives an affect from eating", async () => {
    // given
    const food = testBuilder.withItem()
      .asFood()
      .addToPlayerBuilder(playerBuilder)
      .addAffect(AffectType.Poison)
      .build()

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Eat, `eat ${food.name}`))

    // then
    expect(response.message.getMessageToRequestCreator()).toContain("and suddenly feel different")
  })

  it("should not allow eating food not in inventory", async () => {
    // given
    const food = testBuilder.withItem()
      .asFood()
      .addToRoomBuilder(testBuilder.withRoom())
      .build()

    // when
    const response = await action.handle(
      testBuilder.createRequest(RequestType.Eat, `eat ${food.name}`))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.All.Item.NotOwned)
  })

  it("should not allow eating items that are not food", async () => {
    // given
    const eq = testBuilder.withItem()
      .asHelmet()
      .addToPlayerBuilder(playerBuilder)
      .build()

    // when
    const response = await action.handle(
      testBuilder.createRequest(RequestType.Eat, `eat ${eq.name}`))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.Eat.NotFood)
  })

  it("should not allow eating when already full", async () => {
    // given
    playerBuilder.setHunger(appetite(playerBuilder.player.sessionMob.race))
    const food = testBuilder.withItem()
      .asFood()
      .addToPlayerBuilder(playerBuilder)
      .build()

    // when
    const response = await action.handle(
      testBuilder.createRequest(RequestType.Eat, `eat ${food.name}`))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.Eat.AlreadyFull)
  })

  it("should allow eating when all conditions are met", async () => {
    // given
    const food = testBuilder.withItem()
      .asFood()
      .addToPlayerBuilder(playerBuilder)
      .build()

    // when
    const response = await action.handle(
      testBuilder.createRequest(RequestType.Eat, `eat ${food.name}`))

    // then
    expect(response.isSuccessful()).toBeTruthy()
  })
})
