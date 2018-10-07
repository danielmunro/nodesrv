import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { newSkill } from "../../skill/factory"
import { SkillType } from "../../skill/skillType"
import { getTestClient } from "../../test/client"
import { Tick } from "./tick"

describe("ticks", () => {
  it("should call tick on all clients", async () => {
    const tick = new Tick()
    const clients = [
      await getTestClient(),
      await getTestClient(),
      await getTestClient(),
      await getTestClient(),
      await getTestClient(),
    ]
    tick.notify(clients)
    clients.forEach((client) => expect(client.ws.send.mock.calls.length).toBeGreaterThan(1))
  })

  it("should invoke fast healing", async () => {
    const tick = new Tick()
    const client1 = await getTestClient()
    client1.player.sessionMob.skills.push(newSkill(SkillType.FastHealing, MAX_PRACTICE_LEVEL))
    const client2 = await getTestClient()
    const test = async () => {
      client1.player.sessionMob.vitals.hp = 1
      client2.player.sessionMob.vitals.hp = 1
      tick.notify([client1, client2])

      return client1.player.sessionMob.vitals.hp > client2.player.sessionMob.vitals.hp
    }

    const times = 100
    const tests = await doNTimes(times, test)

    expect(tests.filter(t => t).length).toBeGreaterThan(times / 2)
  })
})
