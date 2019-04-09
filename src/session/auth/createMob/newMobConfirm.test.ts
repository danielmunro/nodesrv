import {getConnection, initializeConnection} from "../../../support/db/connection"
import { getTestClient } from "../../../support/test/client"
import Name from "../login/name"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import NewMobConfirm from "./newMobConfirm"
import Race from "./race"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

const mockAuthService = jest.fn()

describe("new mob confirm auth step", () => {
  it("should bounce back to mob name if the client selects 'n'", async () => {
    // given
    const client = await getTestClient()

    // setup
    const newMobConfirm = new NewMobConfirm(mockAuthService(), client.player, "foo")

    // when
    const response = await newMobConfirm.processRequest(new Request(client, "n"))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Name)
  })

  it("should proceed to the next step (raceType selection) if 'y' selected", async () => {
    // given
    const client = await getTestClient()

    // setup
    const newMobConfirm = new NewMobConfirm(mockAuthService(), client.player, "foo")

    // when
    const response = await newMobConfirm.processRequest(new Request(client, "y"))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Race)
  })

  it("generates with correct starting attributes", async () => {
    // setup
    const client = await getTestClient()
    const newMobConfirm = new NewMobConfirm(mockAuthService(), client.player, "foo")

    // when
    await newMobConfirm.processRequest(new Request(client, "y"))

    // then
    const maxVitals = newMobConfirm.player.sessionMob.attribute().getVitals()
    expect(maxVitals.hp).toBe(20)
    expect(maxVitals.mana).toBe(100)
    expect(maxVitals.mv).toBe(100)

    // and
    const vitals = newMobConfirm.player.sessionMob.vitals
    expect(vitals.hp).toBe(20)
    expect(vitals.mana).toBe(100)
    expect(vitals.mv).toBe(100)
  })

  it("should error out for any other input", async () => {
    // given
    const client = await getTestClient()

    // setup
    const newMobConfirm = new NewMobConfirm(mockAuthService(), client.player, "foo")

    // when
    const inputs = [
      "abc",
      null,
      "123",
      "yn",
    ]

    // then
    return Promise.all([inputs.map(async (input) => {
      const response = await newMobConfirm.processRequest(new Request(client, input))

      expect(response.status).toBe(ResponseStatus.FAILED)
      expect(response.authStep).toBeInstanceOf(NewMobConfirm)
    })])
  })
})
