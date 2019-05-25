import {EventResponseStatus} from "../enum/eventResponseStatus"
import {EventType} from "../enum/eventType"
import {createTestEvent} from "../factory/eventFactory"
import TestAConsumer from "../test/testAConsumer"
import TestBConsumer from "../test/testBConsumer"
import EventService from "./eventService"

describe("event service", () => {
  it("should consume events", async () => {
    const eventService = new EventService()
    eventService.addConsumer(new TestAConsumer())
    eventService.addConsumer(new TestAConsumer())
    eventService.addConsumer(new TestBConsumer())
    eventService.addConsumer(new TestBConsumer())

    expect((await eventService.publish(createTestEvent(EventType.TestA))).status)
      .toBe(EventResponseStatus.Satisfied)
    expect((await eventService.publish(createTestEvent(EventType.TestB))).status)
      .toBe(EventResponseStatus.None)
    expect((await eventService.publish(createTestEvent(EventType.TestC))).status)
      .toBe(EventResponseStatus.Unhandled)
  })
})
