import { getTestClient } from "../test/client"
import { getTestMob } from "../test/mob"
import Session from "./session"

describe("session", () => {
  it("isLoggedIn sanity check", () => {
    // given
    const mob = getTestMob()
    const session = new Session(getTestClient())

    // expect
    expect(session.isLoggedIn()).toBeFalsy()

    // when
    session.loginWithMob(mob)

    // then
    expect(session.isLoggedIn()).toBeTruthy()
    expect(session.getMob()).toBe(mob)
  })
})
