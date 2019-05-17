import {createTestAppContainer} from "../../app/testFactory"
import DamageEvent from "../../mob/event/damageEvent"
import DamageEventBuilder from "../../mob/event/damageEventBuilder"
import DamageSourceBuilder from "../../mob/fight/damageSourceBuilder"
import {DamageType} from "../../mob/fight/damageType"
import MobBuilder from "../../support/test/mobBuilder"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import AffectBuilder from "../affectBuilder"
import {AffectType} from "../enum/affectType"
import DamageSourceEventConsumer from "./damageSourceEventConsumer"

let consumer: DamageSourceEventConsumer
let mob: MobBuilder
const initialAmount = 100

beforeEach(async () => {
  const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  consumer = new DamageSourceEventConsumer()
  mob = testRunner.createMob()
})

describe("damage source event consumer", () => {
  it("resist damage type reduces damage", async () => {
    mob.addAffect(new AffectBuilder(AffectType.Noop)
      .setResist(new DamageSourceBuilder().enableMental().get())
      .build())

    const eventResponse = await consumer.consume(new DamageEventBuilder(
      mob.get(),
      initialAmount,
      DamageType.Mental).build())

    const event = eventResponse.event as DamageEvent
    expect(event.calculateAmount()).toBeLessThan(initialAmount)
  })

  it("immune reduces damage to 0", async () => {
    mob.addAffect(new AffectBuilder(AffectType.Noop)
      .setImmune(new DamageSourceBuilder().enableMental().get())
      .build())

    const eventResponse = await consumer.consume(new DamageEventBuilder(
      mob.get(),
      initialAmount,
      DamageType.Mental).build())

    const event = eventResponse.event as DamageEvent
    expect(event.calculateAmount()).toBe(0)
  })

  it("vulnerable increases damage", async () => {
    mob.addAffect(new AffectBuilder(AffectType.Noop)
      .setVulnerable(new DamageSourceBuilder().enableMental().get())
      .build())

    const eventResponse = await consumer.consume(new DamageEventBuilder(
      mob.get(),
      initialAmount,
      DamageType.Mental).build())

    const event = eventResponse.event as DamageEvent
    expect(event.calculateAmount()).toBeGreaterThan(initialAmount)
  })

  it("different damage types not affected", async () => {
    mob.addAffect(new AffectBuilder(AffectType.Noop)
      .setResist(new DamageSourceBuilder().enableMental().get())
      .build())

    const eventResponse = await consumer.consume(new DamageEventBuilder(
      mob.mob,
      initialAmount,
      DamageType.Bash).build())

    const event = eventResponse.event as DamageEvent
    expect(event.calculateAmount()).toBe(initialAmount)
  })
})
