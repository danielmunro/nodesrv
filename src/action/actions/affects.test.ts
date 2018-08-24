import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import RequestBuilder from "../../request/requestBuilder"
import { RequestType } from "../../request/requestType"
import { getTestPlayer } from "../../test/player"
import reset from "../../test/reset"
import affects from "./affects"

beforeEach(() => reset())

describe("affects", () => {
  it("should report when an affect is added", async () => {
    // given
    const player = getTestPlayer()
    const mob = player.sessionMob
    mob.addAffect(newAffect(AffectType.Noop, 1))
    mob.addAffect(newAffect(AffectType.Dazed, 2))
    const requestBuilder = new RequestBuilder(player)

    // when
    const response = await affects(requestBuilder.create(RequestType.Affects))

    // then
    expect(response.message).toContain(AffectType.Noop)
    expect(response.message).toContain("hour\n")
    expect(response.message).toContain(AffectType.Dazed)
    expect(response.message).toContain("hours")
    expect(response.message).not.toContain(AffectType.Shield)
  })
})
