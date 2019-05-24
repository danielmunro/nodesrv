import { getTestMob } from "../../support/test/mob"
import { newPlayer } from "./factory"

describe("player factory", () => {
  it("should set the name and session mob", () => {
    const name = "a test player"
    const sessionMob = getTestMob()
    const player = newPlayer(name, sessionMob)
    expect(player.name).toBe(name)
    expect(player.sessionMob).toBe(sessionMob)
    expect(player.mobs.indexOf(sessionMob)).toBeGreaterThanOrEqual(0)
  })
})
