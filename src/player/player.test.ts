import { getTestMob } from "../test/mob"
import { getTestPlayer } from "../test/player"

describe("player model", () => {
  it("should not own a random mob", () => {
    const player = getTestPlayer()
    const mob = getTestMob()
    expect(player.ownsMob(mob)).toBeFalsy()
  })
})
