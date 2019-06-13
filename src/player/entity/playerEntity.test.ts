import { getTestMob } from "../../support/test/mob"
import { getTestPlayer } from "../../support/test/player"

describe("player entity", () => {
  it("should not own a random mob", () => {
    const player = getTestPlayer()
    const mob = getTestMob()
    expect(player.ownsMob(mob)).toBeFalsy()
  })

  it("should describe mobs it owns", () => {
    const player = getTestPlayer()
    const mob1 = getTestMob()
    const mob2 = getTestMob()
    const mob3 = getTestMob()
    const mob4 = getTestMob()
    player.mobs = [mob1, mob2, mob3]
    expect(player.ownsMob(mob1)).toBeTruthy()
    expect(player.ownsMob(mob2)).toBeTruthy()
    expect(player.ownsMob(mob3)).toBeTruthy()
    expect(player.ownsMob(mob4)).toBeFalsy()
  })
})
