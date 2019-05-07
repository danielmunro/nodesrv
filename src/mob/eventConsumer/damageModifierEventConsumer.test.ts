import {createTestAppContainer} from "../../app/testFactory"
import {DamageType} from "../../damage/damageType"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import DamageEvent from "../event/damageEvent"
import {Mob} from "../model/mob"
import {RaceType} from "../race/enum/raceType"
import DamageModifierEventConsumer from "./damageModifierEventConsumer"

let consumer: DamageModifierEventConsumer
let mob: Mob
const initialDamage = 1

beforeEach(async () => {
  consumer = new DamageModifierEventConsumer()
  const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mob = testRunner.createMob()
    .withRace(RaceType.Giant)
    .get()
})

describe("damage modifier event consumer", () => {
  it("increases the damage amount on a matching vulnerability", async () => {
    // given
    const event = new DamageEvent(mob, initialDamage, DamageType.Magic)

    // when
    const response = await consumer.consume(event)

    // then
    const newEvent = response.event as DamageEvent
    expect(newEvent.amount).toBeGreaterThan(event.amount)
  })

  it("decreases the damage amount on a matching resist", async () => {
    // given
    const event = new DamageEvent(mob, initialDamage, DamageType.Frost)

    // when
    const response = await consumer.consume(event)

    // then
    const newEvent = response.event as DamageEvent
    expect(newEvent.amount).toBeLessThan(event.amount)
  })

  it("decreases the damage amount to zero if invulnerable", async () => {
    // given
    mob.raceType = RaceType.Goblin
    const event = new DamageEvent(mob, initialDamage, DamageType.Poison)

    // when
    const response = await consumer.consume(event)

    // then
    const newEvent = response.event as DamageEvent
    expect(newEvent.amount).toBe(0)
  })

  it("does not modify the damage when no vulnerability matches are found", async () => {
    // given
    const event = new DamageEvent(mob, initialDamage, DamageType.Poison)

    // when
    const response = await consumer.consume(event)

    // then
    const newEvent = response.event as DamageEvent
    expect(newEvent.amount).toBe(event.amount)
  })
})
