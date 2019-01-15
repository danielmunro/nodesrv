import appetite from "../../mob/race/appetite"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import {Action} from "../action"
import {Messages} from "./constants"

let testBuilder: TestBuilder
let actionDefinition: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  actionDefinition = await testBuilder.getActionDefinition(RequestType.Eat)
})

describe("eat action preconditions", () => {
  it("should not allow eating food not in inventory", async () => {
    // given
    await testBuilder.withPlayer()
    const food = testBuilder.withRoom().withFood()

    // when
    const response = await actionDefinition.handle(
      testBuilder.createRequest(RequestType.Eat, `eat ${food.name}`))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.All.Item.NotOwned)
  })

  it("should not allow eating items that are not food", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer()
    const eq = playerBuilder.withHelmetEq()

    // when
    const response = await actionDefinition.handle(
      testBuilder.createRequest(RequestType.Eat, `eat ${eq.name}`))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Eat.NotFood)
  })

  it("should not allow eating when already full", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer()
    const mob = playerBuilder.player.sessionMob
    mob.playerMob.hunger = appetite(mob.race)
    const food = playerBuilder.withFood()

    // when
    const response = await actionDefinition.handle(
      testBuilder.createRequest(RequestType.Eat, `eat ${food.name}`))

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Eat.AlreadyFull)
  })

  it("should allow eating when all conditions are met", async () => {
    // given
    const playerBuilder = await testBuilder.withPlayer()
    const food = playerBuilder.withFood()

    // when
    const response = await actionDefinition.handle(
      testBuilder.createRequest(RequestType.Eat, `eat ${food.name}`))

    // then
    expect(response.isSuccessful()).toBeTruthy()
  })
})
