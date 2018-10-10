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
    mob.addAffect(newAffect(AffectType.Stunned, 2))

    // when
    const response = await affects(new Request(mob, new InputContext(RequestType.Affects)))
    const message = response.message.toRequestCreator

    // then
    expect(message).toContain(AffectType.Noop)
    expect(message).toContain("hour\n")
    expect(message).toContain(AffectType.Stunned)
    expect(message).toContain("hours")
    expect(message).not.toContain(AffectType.Shield)
  })
})
