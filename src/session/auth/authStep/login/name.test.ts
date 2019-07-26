import {AsyncContainerModule} from "inversify"
// @ts-ignore
import * as sillyname from "sillyname"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import MobRepository from "../../../../mob/repository/mob"
import {getConnection, initializeConnection} from "../../../../support/db/connection"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import {CreationMessages} from "../../constants"
import { ResponseStatus } from "../../enum/responseStatus"
import Request from "../../request"
import CreationService from "../../service/creationService"
import Complete from "../complete"
import NewMobConfirm from "../createMob/newMobConfirm"
import Name from "./name"

let testRunner: TestRunner
let creationService: CreationService

beforeAll(async () => {
  await initializeConnection()
})

afterAll(async () => {
  await (await getConnection()).close()
})

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  creationService = app.get<CreationService>(Types.CreationService)
})

describe("auth login name", () => {
  it("should be able to request a new mob", async () => {
    // setup -- rebind the mob repository with different mock behavior
    const app = await createTestAppContainer(async container =>
      new AsyncContainerModule(async bind => {
        container.unbind(Types.MobRepository)
        bind<MobRepository>(Types.MobRepository).toConstantValue(
          jest.fn(() => ({
            findOneByName: async () => undefined,
          }))() as any)
      }))
    testRunner = app.get<TestRunner>(Types.TestRunner)
    creationService = app.get<CreationService>(Types.CreationService)

    // setup -- create a client
    const client = testRunner.createClient()
    client.player = (await testRunner.createPlayer()).get()
    const name = new Name(creationService, client.player)

    // given
    const validMobName = sillyname()

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
    await creationService.savePlayer(client1.player)
    await creationService.savePlayer(client2.player)

    // setup -- create a name auth step
    const name = new Name(creationService, client1.player)

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
    const name = new Name(creationService, client.player)

    // when
    const response = await name.processRequest(new Request(client, mobName))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Complete)
  })
})
