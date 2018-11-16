import { newStartingAttributes, newVitals } from "../../attributes/factory"
import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { newMobLocation } from "../../mob/factory"
import LocationService from "../../mob/locationService"
import { newSkill } from "../../skill/factory"
import { SkillType } from "../../skill/skillType"
import { getTestClient } from "../../test/client"
import { getTestRoom } from "../../test/room"
import { Tick } from "./tick"

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

    const tick = new Tick(new LocationService(clients.map(c => newMobLocation(c.getSessionMob(), getTestRoom()))))

    // when
    await tick.notify(clients)

    // then
    clients.forEach((client) => expect(client.ws.send.mock.calls.length).toBeGreaterThan(1))
  })

  it("should invoke fast healing", async () => {
    // given
    const client1 = await getTestClient()
    const mob1 = client1.getSessionMob()
    mob1.level = 50
    mob1.attributes.push(newStartingAttributes(newVitals(1000, 0, 0)))
    mob1.skills.push(newSkill(SkillType.FastHealing, MAX_PRACTICE_LEVEL))

    // and
    const client2 = await getTestClient()
    const mob2 = client2.getSessionMob()
    mob2.level = 50
    mob2.attributes.push(newStartingAttributes(newVitals(1000, 0, 0)))

    const tick = new Tick(new LocationService([
      newMobLocation(mob1, getTestRoom()),
      newMobLocation(mob2, getTestRoom()),
    ]))

    // when
    const test = async () => {
      mob1.vitals.hp = 1
      mob2.vitals.hp = 1
      await tick.notify([client1, client2])

      return mob1.vitals.hp > mob2.vitals.hp
    }
    const times = 1000
    const tests = await doNTimes(times, test)

    // then
    expect(tests.filter(t => t).length).toBeGreaterThan(times / 2)
  })
})
