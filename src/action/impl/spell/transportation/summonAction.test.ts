import {createTestAppContainer} from "../../../../app/testFactory"
import EventConsumer from "../../../../event/eventConsumer"
import EventResponse from "../../../../event/eventResponse"
import EventService from "../../../../event/eventService"
import {EventType} from "../../../../event/eventType"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import MobService from "../../../../mob/mobService"
import {RequestType} from "../../../../request/requestType"
import RoomMessageEvent from "../../../../room/event/roomMessageEvent"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let target: MobBuilder
let mobService: MobService
let eventService: EventService
const responseMessage = "you arrive in a puff of smoke!"

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  testRunner.createMob()
    .withSpell(SpellType.Summon, MAX_PRACTICE_LEVEL)
    .setLevel(30)
  testRunner.createRoom()
  target = testRunner.createMob()
  mobService = app.get<MobService>(Types.MobService)
  eventService = app.get<EventService>(Types.EventService)
})

describe("summon spell action", () => {
  it("summons a mob when able", async () => {
    // when
    await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast 'summon' ${target.getMobName()}`)

    // then
    expect(mobService.getMobsByRoom(testRunner.getStartRoom().get())).toHaveLength(2)
  })

  it("generates accurate success messages when casting on a target", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(
      RequestType.Cast, `cast 'summon' ${target.getMobName()}`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${target.getMobName()} arrives in a puff of smoke!`)
    expect(response.getMessageToTarget()).toBe(responseMessage)
    expect(response.getMessageToObservers()).toBe(`${target.getMobName()} arrives in a puff of smoke!`)
  })

  it("generates accurate success messages in the target room", async () => {
    const testConsumer = class implements EventConsumer {
      public messages: RoomMessageEvent[] = []

      public consume(event: RoomMessageEvent): Promise<EventResponse> {
        this.messages.push(event)
        return EventResponse.none(event)
      }

      public getConsumingEventTypes(): EventType[] {
        return [ EventType.RoomMessage ]
      }
    }

    const consumer = new testConsumer()
    eventService.addConsumer(consumer)

    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, `cast 'summon' ${target.getMobName()}`)

    // then
    expect(consumer.messages).toHaveLength(1)

    const response = consumer.messages[0]

    expect(response.message.getMessageToRequestCreator()).toBe("you disappear in a puff of smoke!")
    expect(response.message.getMessageToTarget()).toBe("you disappear in a puff of smoke!")
    expect(response.message.getMessageToObservers()).toBe(`${target.getMobName()} disappears in a puff of smoke!`)
  })
})
