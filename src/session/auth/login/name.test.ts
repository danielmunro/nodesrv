import * as sillyname from "sillyname"
import {createTestAppContainer} from "../../../app/testFactory"
import MobService from "../../../mob/mobService"
import MobTable from "../../../mob/mobTable"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import Complete from "../complete"
import {CreationMessages} from "../constants"
import NewMobConfirm from "../createMob/newMobConfirm"
import CreationService from "../creationService"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Name from "./name"

let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

async function getAuthService(mobTable: MobTable = new MobTable(), mobTemplateTable: MobTable = new MobTable()) {
  return new CreationService(jest.fn()(), new MobService(mobTemplateTable, undefined, mobTable, undefined))
}

describe("auth login name", () => {
  it("should be able to request a new mob", async () => {
    // given
    const validMobName = sillyname()

    // setup
    const client = testRunner.createClient()
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
    const table = new MobTable()
    table.add(client1.getSessionMob())
    table.add(client2.getSessionMob())

    // setup -- create a name auth step
    const name = new Name(await getAuthService(new MobTable(), table), client1.player)

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
    const table = new MobTable()
    table.add(client.getSessionMob())
    const name = new Name(await getAuthService(new MobTable(), table), client.player)

    // when
    const response = await name.processRequest(new Request(client, mobName))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Complete)
  })
})
