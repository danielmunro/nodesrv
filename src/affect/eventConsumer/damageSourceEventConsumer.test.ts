import {createTestAppContainer} from "../../app/testFactory"
import {DamageType} from "../../damage/damageType"
import DamageSourceBuilder from "../../mob/damageSourceBuilder"
import DamageEvent from "../../mob/event/damageEvent"
import MobBuilder from "../../support/test/mobBuilder"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import AffectBuilder from "../affectBuilder"
import {AffectType} from "../affectType"
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

    const eventResponse = await consumer.consume(new DamageEvent(
      mob.mob,
      initialAmount,
      DamageType.Mental))

    const event = eventResponse.event as DamageEvent
    expect(event.amount).toBeLessThan(initialAmount)
  })

  it("immune reduces damage to 0", async () => {
    mob.addAffect(new AffectBuilder(AffectType.Noop)
      .setImmune(new DamageSourceBuilder().enableMental().get())
      .build())

    const eventResponse = await consumer.consume(new DamageEvent(
      mob.mob,
      initialAmount,
      DamageType.Mental))

    const event = eventResponse.event as DamageEvent
    expect(event.amount).toBe(0)
  })

  it("vulnerable increases damage", async () => {
    mob.addAffect(new AffectBuilder(AffectType.Noop)
      .setVulnerable(new DamageSourceBuilder().enableMental().get())
      .build())

    const eventResponse = await consumer.consume(new DamageEvent(
      mob.mob,
      initialAmount,
      DamageType.Mental))

    const event = eventResponse.event as DamageEvent
    expect(event.amount).toBeGreaterThan(initialAmount)
  })

  it("different damage types not affected", async () => {
    mob.addAffect(new AffectBuilder(AffectType.Noop)
      .setResist(new DamageSourceBuilder().enableMental().get())
      .build())

    const eventResponse = await consumer.consume(new DamageEvent(
      mob.mob,
      initialAmount,
      DamageType.Bash))

    const event = eventResponse.event as DamageEvent
    expect(event.amount).toBe(initialAmount)
  })
})
