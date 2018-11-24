import { getTestPlayer } from "../test/player"
import { savePlayer } from "./service"

describe("player gameService", () => {
  it("should be able to save a player", async () => {
    const player = await savePlayer(getTestPlayer())
    expect(player.id).toBeGreaterThan(0)
  })
})
