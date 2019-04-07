import {getConnection, initializeConnection} from "../support/db/connection"
import { getTestPlayer } from "../support/test/player"
import { savePlayer } from "./service"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("player gameService", () => {
  it("should be able to save a player", async () => {
    const player = await savePlayer(getTestPlayer())
    expect(player.id).toBeGreaterThan(0)
  })
})
