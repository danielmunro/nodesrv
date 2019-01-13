import { getPlayerRepository } from "../player/repository/player"
import {getConnection, initializeConnection} from "../support/db/connection"
import { getTestClient } from "../test/client"
import { getTestMob } from "../test/mob"
import { getTestPlayer } from "../test/player"
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
    const mob = getTestMob()
    const player = getTestPlayer()
    player.sessionMob = mob
    const client = await getTestClient()
    const session = new Session(
      new Email(new AuthService(await getPlayerRepository(), null)),
    )

    // expect
    expect(session.isLoggedIn()).toBeFalsy()

    // when
    await session.login(client, player)

    // then
    expect(session.isLoggedIn()).toBeTruthy()
    expect(session.getPlayer()).toBe(player)
    expect(session.getMob()).toBe(mob)
  })

  it("should login when complete", async () => {
    // given
    const client = await getTestClient()
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
