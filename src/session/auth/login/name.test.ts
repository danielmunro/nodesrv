import * as sillyname from "sillyname"
import {createTestAppContainer} from "../../../app/factory/testFactory"
import {getMobRepository} from "../../../mob/repository/mob"
import {getPlayerRepository} from "../../../player/repository/player"
import {getConnection, initializeConnection} from "../../../support/db/connection"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import Complete from "../complete"
import {CreationMessages} from "../constants"
import NewMobConfirm from "../createMob/newMobConfirm"
import CreationService from "../creationService"
import { ResponseStatus } from "../enum/responseStatus"
import Request from "../request"
import Name from "./name"

let testRunner: TestRunner

beforeAll(async () => {
  await initializeConnection()
})

afterAll(async () => {
  await (await getConnection()).close()
})

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

async function getAuthService() {
  return new CreationService(await getPlayerRepository(), await getMobRepository(), [], jest.fn()())
}

describe("auth login name", () => {
  it("should be able to request a new mob", async () => {
    // given
    const validMobName = sillyname()

    // setup
    const client = testRunner.createClient()
    client.player = testRunner.createPlayer().get()
    const name = new Name(await getAuthService(), client.player)

    // when
    const response = await name.processRequest(new Request(client, validMobName))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(NewMobConfirm)
  })

  it("should not allow a player to use another player's mob", async () => {
    // given
    const player1MobName = sillyname()
    const player2MobName = sillyname()

    // setup -- persist some players/mobs
    const client1 = await testRunner.createLoggedInClient()
    const client2 = await testRunner.createLoggedInClient()
    client1.getSessionMob().name = player1MobName
    client2.getSessionMob().name = player2MobName
    const authService = await getAuthService()
    await authService.savePlayer(client1.player)
    await authService.savePlayer(client2.player)

    // setup -- create a name auth step
    const name = new Name(authService, client1.player)

    // when
    const response = await name.processRequest(new Request(client1, player2MobName))

    // then
    expect(response.status).toBe(ResponseStatus.FAILED)
    expect(response.authStep).toBeInstanceOf(Name)
    expect(response.message).toBe(CreationMessages.Mob.NameUnavailable)
  })

  it("should be able to log into a player's own mob", async () => {
    // given
    const mobName = sillyname()

    // setup
    const client = await testRunner.createLoggedInClient()
    client.getSessionMob().name = mobName
    const name = new Name(await getAuthService(), client.player)

    // when
    const response = await name.processRequest(new Request(client, mobName))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Complete)
  })
})
