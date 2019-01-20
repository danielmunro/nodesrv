import EventService from "../../event/eventService"
import TimeService from "../../gameService/timeService"
import {MAX_PRACTICE_LEVEL} from "../../mob/constants"
import {newMobLocation} from "../../mob/factory"
import LocationService from "../../mob/locationService"
import FastHealingEventConsumer from "../../skill/eventConsumer/fastHealingEventConsumer"
import {newSkill} from "../../skill/factory"
import {SkillType} from "../../skill/skillType"
import {getConnection, initializeConnection} from "../../support/db/connection"
import {getTestClient} from "../../test/client"
import {getTestRoom} from "../../test/room"
import TestBuilder from "../../test/testBuilder"
import {Tick} from "./tick"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

function getLocationService(clients) {
  return new LocationService(null, null, null, clients.map(c => newMobLocation(c.getSessionMob(), getTestRoom())))
}

describe("ticks", () => {
  it("should call tick on all clients", async () => {
    // given
    const clients = [
      await getTestClient(),
      await getTestClient(),
      await getTestClient(),
      await getTestClient(),
      await getTestClient(),
    ]

    const tick = new Tick(
      new TimeService(),
      new EventService(),
      getLocationService(clients))

    // when
    await tick.notify(clients)

    // then
    clients.forEach((client) => expect(client.ws.send.mock.calls.length).toBeGreaterThan(1))
  })

  it("should invoke fast healing on tick", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    const client = await testBuilder.withClient()
    client.getSessionMob().skills.push(newSkill(SkillType.FastHealing, MAX_PRACTICE_LEVEL))
    const clients = [client]
    const mockSkill = jest.fn(() => ({
      doAction: jest.fn(() => ({
        isSuccessful: jest.fn(),
      })),
    }))()

    // when
    await new Tick(
      new TimeService(),
      new EventService([
        new FastHealingEventConsumer(mockSkill),
      ]),
      getLocationService(clients)).notify(clients)

    // then
    expect(mockSkill.doAction.mock.calls.length).toBe(1)
  })
})
