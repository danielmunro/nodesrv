import {createTestAppContainer} from "../../app/factory/testFactory"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import Complete from "../auth/authStep/complete"
import Email from "../auth/authStep/login/email"
import Request from "../auth/request"
import CreationService from "../auth/service/creationService"
import SessionService from "./sessionService"

const mockAuthService = jest.fn()
let testRunner: TestRunner
let creationService: CreationService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  creationService = app.get<CreationService>(Types.CreationService)
})

describe("session", () => {
  it("isLoggedIn sanity createDefaultCheckFor", async () => {
    // given
    const playerBuilder = await testRunner.createPlayer()
    const player = playerBuilder.player
    const client = testRunner.createClient()
    const session = new SessionService(
      new Email(creationService))

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
    const session = new SessionService(
      new Complete(mockAuthService(), (await testRunner.createPlayer()).get()),
    )

    // expect
    expect(session.isLoggedIn()).toBeFalsy()

    // when
    await session.handleRequest(client, new Request(client, ""))

    // then
    expect(session.isLoggedIn()).toBeTruthy()
  })
})
