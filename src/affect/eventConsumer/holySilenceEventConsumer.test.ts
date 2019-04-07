import InputEvent from "../../client/event/inputEvent"
import {Fight} from "../../mob/fight/fight"
import {RequestType} from "../../request/requestType"
import MobBuilder from "../../support/test/mobBuilder"
import TestBuilder from "../../support/test/testBuilder"
import {AffectType} from "../affectType"
import HolySilenceEventConsumer from "./holySilenceEventConsumer"

let testBuilder: TestBuilder
let consumer: HolySilenceEventConsumer
let fight: Fight
let caster: MobBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  consumer = new HolySilenceEventConsumer()
  caster = testBuilder.withMob()
  fight = await testBuilder.fight()
})

describe("holy silence event consumer", () => {
  it("does nothing if a mob has not affected", async () => {
    // when
    const eventResponse = await consumer.consume(
      new InputEvent(caster.mob, testBuilder.createRequest(RequestType.Cast), jest.fn()()))

    // then
    expect(eventResponse.isSatisifed()).toBeFalsy()
  })

  it("satisfies event if caster has affected", async () => {
    // setup
    caster.addAffectType(AffectType.HolySilence)

    // when
    const eventResponse = await consumer.consume(
      new InputEvent(caster.mob, testBuilder.createRequest(RequestType.Cast), jest.fn()()))

    // then
    expect(eventResponse.isSatisifed()).toBeTruthy()
  })
})
