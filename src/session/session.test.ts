import { getPlayerRepository } from "../player/repository/player"
import {getConnection, initializeConnection} from "../support/db/connection"
import TestBuilder from "../test/testBuilder"
import AuthService from "./auth/authService"
import Complete from "./auth/complete"
import Email from "./auth/login/email"
import Request from "./auth/request"
import Session from "./session"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

const mockAuthService = jest.fn()

describe("session", () => {
  it("isLoggedIn sanity createDefaultCheckFor", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const player = playerBuilder.player
    const client = await testBuilder.withClient()
    const session = new Session(
      new Email(new AuthService(await getPlayerRepository(), jest.fn()())),
    )

    // expect
    expect(session.isLoggedIn()).toBeFalsy()

    // when
    await session.login(client, player)

    // then
    expect(session.isLoggedIn()).toBeTruthy()
    expect(session.getPlayer()).toBe(player)
    expect(session.getMob()).toBe(player.sessionMob)
  })

  it("should login when complete", async () => {
    // given
    const testBuilder = new TestBuilder()
    const client = await testBuilder.withClient()
    const session = new Session(
      new Complete(mockAuthService(), client.player),
    )

    // expect
    expect(session.isLoggedIn()).toBeFalsy()

    // when
    await session.handleRequest(client, new Request(client, ""))

    // then
    expect(session.isLoggedIn()).toBeTruthy()
  })
})
