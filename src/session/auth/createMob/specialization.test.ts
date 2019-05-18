import {createTestAppContainer} from "../../../app/testFactory"
import { allSpecializations } from "../../../mob/specialization/constants"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import { ResponseStatus } from "../enum/responseStatus"
import Request from "../request"
import CustomizeCheck from "./customizeCheck"
import Specialization from "./specialization"

const mockAuthService = jest.fn()

describe("specialization create mob auth step", () => {
  it("should not allow invalid specialization options", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)

    // given
    const badInputs = [
      "foo",
      "magi",
      "warrioe",
    ]

    // setup
    const client = testRunner.createClient()
    const specialization = new Specialization(mockAuthService(), client.player)

    // when
    return Promise.all(badInputs.map(async (badInput) => {
      const response = await specialization.processRequest(new Request(client, badInput))
      expect(response.status).toBe(ResponseStatus.FAILED)
      expect(response.authStep).toBeInstanceOf(Specialization)
    }))
  })

  it("should allow valid customizations", async () => {
    return Promise.all(allSpecializations.map(async (input) => {
      // setup
      const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
      const client = testRunner.createClient()
      await client.session.login(client, testRunner.createPlayer().get())

      // given
      const specialization = new Specialization(mockAuthService(), client.player)

      // when
      const response = await specialization.processRequest(new Request(client, input))

      // then
      expect(response.status).toBe(ResponseStatus.OK)
      expect(response.authStep).toBeInstanceOf(CustomizeCheck)
    }))
  })
})
