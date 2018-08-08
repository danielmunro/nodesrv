import { getTestClient } from "../test/client"
import { getTestMob } from "../test/mob"
import { getTestPlayer } from "../test/player"
import Complete from "./auth/complete"
import Request from "./auth/request"
import Session from "./session"

describe("session", () => {
  it("isLoggedIn sanity check", async () => {
    // given
    const mob = getTestMob()
    const player = getTestPlayer()
    player.sessionMob = mob
    const client = await getTestClient()
    const session = new Session(client)

    // expect
    expect(session.isLoggedIn()).toBeFalsy()

    // when
    await session.login(player)

    // then
    expect(session.isLoggedIn()).toBeTruthy()
    expect(session.getPlayer()).toBe(player)
    expect(session.getMob()).toBe(mob)
    expect(session.getMob().room).toBe(client.getStartRoom())
  })

  it("should login when complete", async () => {
    // given
    const client = await getTestClient()
    const session = new Session(client, new Complete(client.player))

    // expect
    expect(session.isLoggedIn()).toBeFalsy()

    // when
    await session.handleRequest(new Request(client, ""))

    // then
    expect(session.isLoggedIn()).toBeTruthy()
  })
})
