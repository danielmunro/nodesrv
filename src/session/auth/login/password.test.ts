import hash from "../../../player/password/hash"
import { savePlayer } from "../../../player/service"
import {getConnection, initializeConnection} from "../../../support/db/connection"
import { getTestClient } from "../../../test/client"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Name from "./name"
import Password from "./password"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

const mockAuthService = jest.fn()

describe("password login auth step", () => {
  it("should be able to login in", async () => {
    // given
    const playerPassword = "s3crets"

    // setup
    const client = await getTestClient()
    client.player.password = hash(playerPassword)
    await savePlayer(client.player)
    const password = new Password(mockAuthService(), client.player)

    // when
    const response = await password.processRequest(new Request(client, playerPassword))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Name)
  })

  it("should fail login with the wrong password", async () => {
    // given
    const playerPassword = "s3crets"
    const input = "notsecret"

    // setup
    const client = await getTestClient()
    client.player.password = hash(playerPassword)
    await savePlayer(client.player)
    const password = new Password(mockAuthService(), client.player)

    // when
    const response = await password.processRequest(new Request(client, input))

    // then
    expect(response.status).toBe(ResponseStatus.FAILED)
    expect(response.authStep).toBeInstanceOf(Password)
  })
})
