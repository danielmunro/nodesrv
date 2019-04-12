import {EventType} from "../../event/eventType"
import TestBuilder from "../../support/test/testBuilder"
import {Disposition} from "../enum/disposition"
import MobEvent from "../event/mobEvent"
import DeathTimerEventConsumer from "./deathTimerEventConsumer"

describe("death timer event consumer", () => {
  it("should make a mob dead if it has a death timer", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const mob = testBuilder.withMob().mob
    mob.deathTimer = 1

    // when
    const service = await testBuilder.getService()
    const eventConsumer = new DeathTimerEventConsumer(testBuilder.eventService, service.mobService.locationService)
    await eventConsumer.consume(new MobEvent(EventType.Tick, mob))

    // then
    expect(mob.deathTimer).toBe(0)
    expect(mob.disposition).toBe(Disposition.Dead)
  })
})
