import {createTestAppContainer} from "../../app/testFactory"
import {EventType} from "../../event/eventType"
import FightEvent from "../../mob/fight/event/fightEvent"
import {Fight} from "../../mob/fight/fight"
import MobBuilder from "../../support/test/mobBuilder"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {AffectType} from "../affectType"
import HasteEventConsumer from "./hasteEventConsumer"

let consumer: HasteEventConsumer
let fight: Fight
let mob: MobBuilder

beforeEach(async () => {
  const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  consumer = new HasteEventConsumer()
  mob = testRunner.createMob()
  fight = testRunner.fight()
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
