import * as sillyname from "sillyname"
import { Client } from "../../../client/client"
import { savePlayer } from "../../../player/service"
import { getTestClient } from "../../../test/client"
import { getTestMob } from "../../../test/mob"
import Complete from "../complete"
import { MESSAGE_UNAVAILABLE } from "../constants"
import NewMobConfirm from "../createMob/newMobConfirm"
import Request from "../request"
import { ResponseStatus } from "../responseStatus"
import Name from "./name"

async function createAuthUser(name: string): Promise<Client> {
  const client = getTestClient()
  const mob = getTestMob(name)
  mob.player = client.player
  mob.isPlayer = true
  client.player.mobs.push(mob)
  await savePlayer(client.player)

  return client
}

describe("auth login name", () => {
  it("should be able to request a new mob", async () => {
    // given
    const validMobName = sillyname()

    // setup
    const client = getTestClient()
    const name = new Name(client.player)

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
    await createAuthUser(player2MobName)

    // setup -- create a name auth step
    const name = new Name(client1.player)

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
    const name = new Name(client.player)

    // when
    const response = await name.processRequest(new Request(client, mobName))

    // then
    expect(response.status).toBe(ResponseStatus.OK)
    expect(response.authStep).toBeInstanceOf(Complete)
  })
})
