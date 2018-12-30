import { allSpecializations } from "../../../mob/specialization/constants"
import {getConnection, initializeConnection} from "../../../support/db/connection"
import { getTestClient } from "../../../test/client"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Complete from "./complete"
import Specialization from "./specialization"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

const mockAuthService = jest.fn()

describe("specialization create mob auth step", () => {
  it("should not allow invalid specialization options", async () => {
    // given
    const badInputs = [
      "foo",
      "magi",
      "warrioe",
    ]

    // setup
    const client = await getTestClient()
    const specialization = new Specialization(mockAuthService(), client.player)

    // when
    return Promise.all(badInputs.map(async (badInput) => {
      const response = await specialization.processRequest(new Request(client, badInput))
      expect(response.status).toBe(ResponseStatus.FAILED)
      expect(response.authStep).toBeInstanceOf(Specialization)
    }))
  })

  it("should allow valid specializations", async () => {
    // when
    return Promise.all(allSpecializations.map(async (input) => {
      const client = await getTestClient()
      const specialization = new Specialization(mockAuthService(), client.player)
      const response = await specialization.processRequest(new Request(client, input))
      expect(response.status).toBe(ResponseStatus.OK)
      expect(response.authStep).toBeInstanceOf(Complete)
    }))
  })
})
