import {EventResponseStatus} from "./eventResponseStatus"
import EventService from "./eventService"
import {EventType} from "./eventType"
import TestAConsumer from "./test/testAConsumer"
import TestBConsumer from "./test/testBConsumer"
import TestEvent from "./test/testEvent"

describe("event service", () => {
  it("should correct events to consumers", async () => {
    const eventService = new EventService()
    eventService.addConsumer(new TestAConsumer())
    eventService.addConsumer(new TestAConsumer())
    eventService.addConsumer(new TestBConsumer())
    eventService.addConsumer(new TestBConsumer())

    expect((await eventService.publish(new TestEvent(EventType.TestA))).eventResponseStatus)
      .toBe(EventResponseStatus.Satisfied)
    expect((await eventService.publish(new TestEvent(EventType.TestB))).eventResponseStatus)
      .toBe(EventResponseStatus.None)
    expect((await eventService.publish(new TestEvent(EventType.TestC))).eventResponseStatus)
      .toBe(EventResponseStatus.Unhandled)
  })
})
