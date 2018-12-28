import {EventResponseStatus} from "../../event/eventResponseStatus"
import {EventType} from "../../event/eventType"
import TestBuilder from "../../test/testBuilder"
import FightEvent from "../fight/event/fightEvent"

describe("wimpy", () => {
  it("should cause a weak mob to flee", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const room1 = testBuilder.withRoom().room
    const room2 = testBuilder.withRoom().room
    const mob = testBuilder.withMob().mob
    const target = testBuilder.withMob().mob
    const fight = await testBuilder.fight(target)
    const service = await testBuilder.getService()

    // given
    target.traits.wimpy = true
    target.vitals.hp = 1

    // when
    let eventResponse: EventResponseStatus = EventResponseStatus.None
    while (eventResponse !== EventResponseStatus.Satisfied) {
      eventResponse = (await service.publishEvent(
        new FightEvent(EventType.AttackRound, mob, fight))).status
    }

    // then
    expect(service.getMobLocation(mob).room).toBe(room1)
    expect(service.getMobLocation(target).room).toBe(room2)

    // and
    service.mobService.filterCompleteFights()
    expect(service.mobService.findFight(f => f === fight)).toBeUndefined()
  })
})
