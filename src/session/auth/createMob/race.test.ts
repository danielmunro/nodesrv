import {createTestAppContainer} from "../../../app/factory/testFactory"
import raceTable from "../../../mob/race/raceTable"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import { ResponseStatus } from "../enum/responseStatus"
import Request from "../request"
import Race from "./race"
import Specialization from "./specialization"

const mockAuthService = jest.fn()
let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("raceType create mob auth step", () => {
  it("should not allow invalid raceType options", async () => {
    // given
    const badInputs = [
      "foo",
      "kitteh",
      "elfv",
    ]

    // setup
    const client = await testRunner.createLoggedInClient()
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
    const client = await testRunner.createLoggedInClient()
    const race = new Race(mockAuthService(), client.player)

    // when
    return Promise.all(raceTable.map(async (input) => {
      const response = await race.processRequest(new Request(client, input.raceType))
      expect(response.status).toBe(ResponseStatus.OK)
      expect(response.authStep).toBeInstanceOf(Specialization)
    }))
  })
})
