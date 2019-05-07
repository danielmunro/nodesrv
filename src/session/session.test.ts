import {createTestAppContainer} from "../inversify.config"
import { getPlayerRepository } from "../player/repository/player"
import {getConnection, initializeConnection} from "../support/db/connection"
import TestRunner from "../support/test/testRunner"
import {Types} from "../support/types"
import AuthService from "./auth/authService"
import Complete from "./auth/complete"
import Email from "./auth/login/email"
import Request from "./auth/request"
import Session from "./session"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

const mockAuthService = jest.fn()
let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("session", () => {
  it("isLoggedIn sanity createDefaultCheckFor", async () => {
    // given
    const playerBuilder = testRunner.createPlayer()
    const player = playerBuilder.player
    const client = testRunner.createClient()
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
    const client = testRunner.createClient()
    const session = new Session(
      new Complete(mockAuthService(), testRunner.createPlayer().get()),
    )

    // expect
    expect(session.isLoggedIn()).toBeFalsy()

    // when
    await session.handleRequest(client, new Request(client, ""))

    // then
    expect(session.isLoggedIn()).toBeTruthy()
  })
})
