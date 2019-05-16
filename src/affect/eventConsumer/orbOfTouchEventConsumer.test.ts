import {createTestAppContainer} from "../../app/testFactory"
import AttackEvent from "../../mob/event/attackEvent"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {AffectType} from "../enum/affectType"
import OrbOfTouchEventConsumer from "./orbOfTouchEventConsumer"

let testRunner: TestRunner
let eventConsumer: OrbOfTouchEventConsumer

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  eventConsumer = new OrbOfTouchEventConsumer()
})

describe("orb of touch event consumer", () => {
  it("removes the affect if triggered", async () => {
    // given
    const attacker = testRunner.createMob()
    const defender = testRunner.createMob().addAffectType(AffectType.OrbOfTouch)

    // when
    await eventConsumer.consume(new AttackEvent(attacker.mob, defender.mob))

    // then
    expect(defender.hasAffect(AffectType.OrbOfTouch)).toBeFalsy()
  })
})
