import AttackEvent from "../../mob/event/attackEvent"
import TestBuilder from "../../support/test/testBuilder"
import {AffectType} from "../affectType"
import OrbOfTouchEventConsumer from "./orbOfTouchEventConsumer"

let testBuilder: TestBuilder
let eventConsumer: OrbOfTouchEventConsumer

beforeEach(() => {
  testBuilder = new TestBuilder()
  eventConsumer = new OrbOfTouchEventConsumer()
})

describe("orb of touch event consumer", () => {
  it("removes the affect if triggered", async () => {
    // given
    const attacker = testBuilder.withMob()
    const defender = testBuilder.withMob().addAffectType(AffectType.OrbOfTouch)

    // when
    await eventConsumer.consume(new AttackEvent(attacker.mob, defender.mob))

    // then
    expect(defender.hasAffect(AffectType.OrbOfTouch)).toBeFalsy()
  })
})
