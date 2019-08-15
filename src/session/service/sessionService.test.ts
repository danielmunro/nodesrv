import {createTestAppContainer} from "../../app/factory/testFactory"
import InputContext from "../../request/context/inputContext"
import {RequestType} from "../../request/enum/requestType"
import Request from "../../request/request"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import Complete from "../auth/authStep/complete"
import Email from "../auth/authStep/login/email"
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
    const player = (await testRunner.createPlayer()).get()
    const room = testRunner.getStartRoom().get()
    const session = new SessionService(
      new Complete(mockAuthService(), player))

    // expect
    expect(session.isLoggedIn()).toBeFalsy()

    // when
    await session.handleRequest(client, new Request(client.getSessionMob(), room, new InputContext(RequestType.Any)))

    // then
    expect(session.isLoggedIn()).toBeTruthy()
  })
})
