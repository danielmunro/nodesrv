import {getPlayerRepository} from "../../../player/repository/player"
import {getConnection, initializeConnection} from "../../../support/db/connection"
import { getTestClient } from "../../../test/client"
import AuthService from "../authService"
import Name from "../login/name"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Complete from "./complete"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

const mockAuthService = jest.fn()

describe("create player auth step: complete", () => {
  it("should proceed to the final step unconditionally", async () => {
    // given
    const client = await getTestClient()

    // when
    const response = await new Complete(mockAuthService(), client.player).processRequest(new Request(client, ""))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Name)
  })

  it("should persist the player", async () => {
    // given
    const client = await getTestClient()

    // expect
    expect(client.player.id).toBeUndefined()

    // when
    await new Complete(new AuthService(await getPlayerRepository(), null), client.player)
      .processRequest(new Request(client, ""))

    // then
    expect(client.player.id).not.toBeUndefined()
  })
})
