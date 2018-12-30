import * as sillyname from "sillyname"
import { Client } from "../../../client/client"
import MobService from "../../../mob/mobService"
import MobTable from "../../../mob/mobTable"
import {getPlayerRepository} from "../../../player/repository/player"
import { savePlayer } from "../../../player/service"
import {getConnection, initializeConnection} from "../../../support/db/connection"
import { getTestClient } from "../../../test/client"
import { getTestMob } from "../../../test/mob"
import AuthService from "../authService"
import Complete from "../complete"
import { MESSAGE_UNAVAILABLE } from "../constants"
import NewMobConfirm from "../createMob/newMobConfirm"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Name from "./name"

async function createAuthUser(name: string): Promise<Client> {
  const client = await getTestClient()
  const mob = getTestMob(name)
  mob.player = client.player
  mob.traits.isNpc = false
  client.player.mobs.push(mob)
  client.session.mob = mob
  await savePlayer(client.player)

  return client
}

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

async function getAuthService(mobTable: MobTable = new MobTable()) {
  return new AuthService(await getPlayerRepository(), new MobService(mobTable))
}

describe("auth login name", () => {
  it("should be able to request a new mob", async () => {
    // given
    const validMobName = sillyname()

    // setup
    const client = await getTestClient()
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
    const client1 = await createAuthUser(player1MobName)
    const client2 = await createAuthUser(player2MobName)
    const table = client1.getMobTable()
    table.add(client1.getSessionMob())
    table.add(client2.getSessionMob())

    // setup -- create a name auth step
    const name = new Name(await getAuthService(table), client1.player)

    // when
    const response = await name.processRequest(new Request(client1, player2MobName))

    // then
    expect(response.status).toBe(ResponseStatus.FAILED)
    expect(response.authStep).toBeInstanceOf(Name)
    expect(response.message).toBe(MESSAGE_UNAVAILABLE)
  })

  it("should be able to log into a player's own mob", async () => {
    // given
    const mobName = sillyname()

    // setup
    const client = await createAuthUser(mobName)
    const table = client.getMobTable()
    table.add(client.getSessionMob())
    const name = new Name(await getAuthService(table), client.player)

    // when
    const response = await name.processRequest(new Request(client, mobName))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Complete)
  })
})
