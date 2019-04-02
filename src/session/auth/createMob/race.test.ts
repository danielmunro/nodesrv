import raceTable from "../../../mob/race/raceTable"
import {getConnection, initializeConnection} from "../../../support/db/connection"
import { getTestClient } from "../../../test/client"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Race from "./race"
import Specialization from "./specialization"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

const mockAuthService = jest.fn()

describe("raceType create mob auth step", () => {
  it("should not allow invalid raceType options", async () => {
    // given
    const badInputs = [
      "foo",
      "kitteh",
      "elfv",
    ]

    // setup
    const client = await getTestClient()
    const race = new Race(mockAuthService(), client.player)

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
    const race = new Race(mockAuthService(), client.player)

    // when
    return Promise.all(raceTable.map(async (input) => {
      const response = await race.processRequest(new Request(client, input.raceType))
      expect(response.status).toBe(ResponseStatus.OK)
      expect(response.authStep).toBeInstanceOf(Specialization)
    }))
  })
})
