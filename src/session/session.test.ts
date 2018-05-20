import { getTestClient } from "../test/client"
import { getTestMob } from "../test/mob"
import { getTestPlayer } from "../test/player"
import Session from "./session"

describe("session", () => {
  it("isLoggedIn sanity check", () => {
    // given
    const mob = getTestMob()
    const player = getTestPlayer()
    player.sessionMob = mob
    const client = getTestClient()
    const session = new Session(client)

    // expect
    expect(session.isLoggedIn()).toBeFalsy()

    // when
    session.login(player)

    // then
    expect(session.isLoggedIn()).toBeTruthy()
    expect(session.getPlayer()).toBe(player)
    expect(session.getMob()).toBe(mob)
    expect(session.getMob().room).toBe(client.startRoom)
  })
})
