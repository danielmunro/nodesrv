import AttackEvent from "../../mob/event/attackEvent"
import TestBuilder from "../../support/test/testBuilder"
import {AffectType} from "../affectType"
import DetectTouchEventConsumer from "./detectTouchEventConsumer"

let testBuilder: TestBuilder
let mockEventService: any
let eventConsumer: DetectTouchEventConsumer

beforeEach(async () => {
  testBuilder = new TestBuilder()
  const mock = jest.fn(() => {
    return {
      publish: jest.fn(),
    }
  })
  mockEventService = mock()
  eventConsumer = new DetectTouchEventConsumer(mockEventService)
})

describe("detect touch event consumer", () => {
  it("publishes an event when a touch happens", async () => {
    // given
    const attacker = testBuilder.withMob()
    const defender = testBuilder.withMob().addAffectType(AffectType.DetectTouch)

    // when
    await eventConsumer.consume(new AttackEvent(attacker.mob, defender.mob))

    // then
    expect(mockEventService.publish.mock.calls.length).toBe(1)
  })
})
