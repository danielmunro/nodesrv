import {DamageType} from "../../damage/damageType"
import TestBuilder from "../../test/testBuilder"
import DamageEvent from "../event/damageEvent"
import {Mob} from "../model/mob"
import damageModifierTable from "../race/damageModifierTable"
import {RaceType} from "../race/raceType"
import DamageModifierEventConsumer from "./damageModifierEventConsumer"

let consumer: DamageModifierEventConsumer
let testBuilder: TestBuilder
let mob: Mob
const initialDamage = 1

beforeEach(() => {
  consumer = new DamageModifierEventConsumer(damageModifierTable)
  testBuilder = new TestBuilder()
  mob = testBuilder.withMob().withRace(RaceType.Giant).mob
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
    mob.race = RaceType.Goblin
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
