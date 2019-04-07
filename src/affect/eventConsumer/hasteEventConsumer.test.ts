import {EventType} from "../../event/eventType"
import FightEvent from "../../mob/fight/event/fightEvent"
import {Fight} from "../../mob/fight/fight"
import MobBuilder from "../../support/test/mobBuilder"
import TestBuilder from "../../support/test/testBuilder"
import {AffectType} from "../affectType"
import HasteEventConsumer from "./hasteEventConsumer"

let testBuilder: TestBuilder
let consumer: HasteEventConsumer
let fight: Fight
let mob: MobBuilder

beforeEach(async () => {
  testBuilder = new TestBuilder()
  consumer = new HasteEventConsumer()
  mob = testBuilder.withMob()
  fight = await testBuilder.fight()
})

describe("haste event consumer", () => {
  it("does nothing if a mob has not affected", async () => {
    // given
    const fightEvent = new FightEvent(EventType.AttackRound, mob.mob, fight, [])

    // when
    await consumer.consume(fightEvent)

    // then
    expect(fightEvent.attacks.length).toBe(0)
  })

  it("generates extra attacks", async () => {
    // setup
    mob.addAffectType(AffectType.Haste)

    // given
    const fightEvent = new FightEvent(EventType.AttackRound, mob.mob, fight, [])

    // when
    await consumer.consume(fightEvent)

    // then
    expect(fightEvent.attacks.length).toBe(1)
  })
})
