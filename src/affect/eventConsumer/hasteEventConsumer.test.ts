import {createTestAppContainer} from "../../app/factory/testFactory"
import {EventType} from "../../event/enum/eventType"
import {createFightEvent} from "../../event/factory/eventFactory"
import FightEvent from "../../mob/fight/event/fightEvent"
import {Fight} from "../../mob/fight/fight"
import MobBuilder from "../../support/test/mobBuilder"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {AffectType} from "../enum/affectType"
import HasteEventConsumer from "./hasteEventConsumer"

let consumer: HasteEventConsumer
let fight: Fight
let mob: MobBuilder

beforeEach(async () => {
  const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  consumer = new HasteEventConsumer()
  mob = await testRunner.createMob()
  fight = await testRunner.fight()
})

describe("haste event consumer", () => {
  it("does nothing if a mob has not affected", async () => {
    // given
    const fightEvent = createFightEvent(EventType.AttackRound, mob.mob, fight, [])

    // when
    await consumer.consume(fightEvent)

    // then
    expect(fightEvent.attacks.length).toBe(0)
  })

  it("generates extra attacks", async () => {
    // setup
    mob.addAffectType(AffectType.Haste)

    // given
    const fightEvent = createFightEvent(EventType.AttackRound, mob.mob, fight, [])

    // when
    await consumer.consume(fightEvent)

    // then
    expect(fightEvent.attacks.length).toBe(1)
  })
})
