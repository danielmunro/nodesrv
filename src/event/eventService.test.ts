import {EventResponseStatus} from "./enum/eventResponseStatus"
import {EventType} from "./enum/eventType"
import EventService from "./eventService"
import TestAConsumer from "./test/testAConsumer"
import TestBConsumer from "./test/testBConsumer"
import TestEvent from "./test/testEvent"

describe("event service", () => {
  it("should consume events", async () => {
    const eventService = new EventService()
    eventService.addConsumer(new TestAConsumer())
    eventService.addConsumer(new TestAConsumer())
    eventService.addConsumer(new TestBConsumer())
    eventService.addConsumer(new TestBConsumer())

    expect((await eventService.publish(new TestEvent(EventType.TestA))).status)
      .toBe(EventResponseStatus.Satisfied)
    expect((await eventService.publish(new TestEvent(EventType.TestB))).status)
      .toBe(EventResponseStatus.None)
    expect((await eventService.publish(new TestEvent(EventType.TestC))).status)
      .toBe(EventResponseStatus.Unhandled)
  })
})
