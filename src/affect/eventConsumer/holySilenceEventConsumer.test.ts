import {createTestAppContainer} from "../../app/factory/testFactory"
import {createInputEvent} from "../../event/factory/eventFactory"
import {RequestType} from "../../messageExchange/enum/requestType"
import MobBuilder from "../../support/test/mobBuilder"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {AffectType} from "../enum/affectType"
import HolySilenceEventConsumer from "./holySilenceEventConsumer"

let testRunner: TestRunner
let consumer: HolySilenceEventConsumer
let caster: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  consumer = new HolySilenceEventConsumer()
  caster = await testRunner.createMob()
  await testRunner.fight()
})

describe("holy silence event consumer", () => {
  it("does nothing if a mob is not affected", async () => {
    // when
    const consumable = await consumer.isEventConsumable(
      createInputEvent(
        testRunner.createRequest(RequestType.Cast, "cast holy"),
        jest.fn()()))

    // then
    expect(consumable).toBeFalsy()
  })

  it("satisfies event if caster is affected", async () => {
    // setup
    caster.addAffectType(AffectType.HolySilence)

    // when
    const eventResponse = await consumer.consume(
      createInputEvent(testRunner.createRequest(RequestType.Cast), jest.fn()()))

    // then
    expect(eventResponse.isSatisfied()).toBeTruthy()
  })
})
