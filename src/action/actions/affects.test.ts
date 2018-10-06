import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import InputContext from "../../request/context/inputContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestMob } from "../../test/mob"
import reset from "../../test/reset"
import affects from "./affects"

beforeEach(() => reset())

describe("affects", () => {
  it("should report when an affect is added", async () => {
    // given
    const mob = getTestMob()
    mob.addAffect(newAffect(AffectType.Noop, 1))
    mob.addAffect(newAffect(AffectType.Dazed, 2))

    // when
    const response = await affects(new Request(mob, new InputContext(RequestType.Affects)))

    // then
    expect(response.message).toContain(AffectType.Noop)
    expect(response.message).toContain("hour\n")
    expect(response.message).toContain(AffectType.Dazed)
    expect(response.message).toContain("hours")
    expect(response.message).not.toContain(AffectType.Shield)
  })
})
