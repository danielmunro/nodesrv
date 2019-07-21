import {createTestAppContainer} from "../../app/factory/testFactory"
import {getMobRepository} from "../../mob/repository/mob"
import { getPlayerRepository } from "../../player/repository/player"
import {getConnection, initializeConnection} from "../../support/db/connection"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import { PersistPlayers } from "./persistPlayers"

let testRunner: TestRunner

beforeAll(async () => {
  await initializeConnection()
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})
afterAll(async () => (await getConnection()).close())

describe("persistPlayers", () => {
  it("should save any player models passed in", async () => {
    // setup
    const persistPlayers = new PersistPlayers(await getPlayerRepository(), await getMobRepository())

    // given
    const clients = [
      testRunner.createClient(),
      testRunner.createClient(),
      testRunner.createClient(),
    ]
    for (const client of clients) {
      await client.session.login(client, (await testRunner.createPlayer()).get())
    }

    // when
    await persistPlayers.notify(clients)

    // then
    clients.forEach(client => expect(client.player.id).toBeGreaterThan(0))
  })
})
