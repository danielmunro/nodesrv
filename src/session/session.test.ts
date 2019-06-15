import {createTestAppContainer} from "../app/factory/testFactory"
import TestRunner from "../support/test/testRunner"
import {Types} from "../support/types"
import Complete from "./auth/authStep/complete"
import Email from "./auth/authStep/login/email"
import Request from "./auth/request"
import CreationService from "./auth/service/creationService"
import Session from "./session"

const mockAuthService = jest.fn()
const mockPlayerRepository = jest.fn()
const mockMobService = jest.fn()
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
      new Email(new CreationService(mockPlayerRepository(), mockMobService())))

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
