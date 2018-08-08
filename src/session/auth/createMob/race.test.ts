import { allRaces } from "../../../mob/race/race"
import { getTestClient } from "../../../test/client"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Race from "./race"
import Specialization from "./specialization"

describe("race create mob auth step", () => {
  it("should not allow invalid race options", async () => {
    // given
    const badInputs = [
      "foo",
      "kitteh",
      "elfv",
    ]

    // setup
    const client = await getTestClient()
    const race = new Race(client.player)

    // when
    return Promise.all(badInputs.map(async (badInput) => {
      const response = await race.processRequest(new Request(client, badInput))
      expect(response.status).toBe(ResponseStatus.FAILED)
      expect(response.authStep).toBeInstanceOf(Race)
    }))
  })

  it("should allow playable races", async () => {
    // setup
    const client = await getTestClient()
    const race = new Race(client.player)

    // when
    return Promise.all(allRaces.map(async (input) => {
      const response = await race.processRequest(new Request(client, input))
      expect(response.status).toBe(ResponseStatus.OK)
      expect(response.authStep).toBeInstanceOf(Specialization)
    }))
  })
})
