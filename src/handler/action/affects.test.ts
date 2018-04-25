import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { RequestType } from "../../handler/constants"
import { newSpell } from "../../mob/factory"
import { Request } from "../../server/request/request"
import giantStrength from "../../spell/actions/giantStrength"
import { Check } from "../../spell/check"
import spellCollection from "../../spell/spellCollection"
import { SpellType } from "../../spell/spellType"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import reset from "../../test/reset"
import affects from "./affects"

beforeEach(() => reset())

describe("affects", () => {
  it("should report when an affect is added", () => {
    const player = getTestPlayer()
    const mob = player.sessionMob
    mob.addAffect(newAffect(AffectType.Noop, 1))
    mob.addAffect(newAffect(AffectType.Dazed, 2))
    expect.assertions(5)

    return affects(new Request(player, RequestType.Affects))
      .then((response) => {
        expect(response.message).toContain(AffectType.Noop)
        expect(response.message).toContain("hour\n")
        expect(response.message).toContain(AffectType.Dazed)
        expect(response.message).toContain("hours")
        expect(response.message).not.toContain(AffectType.Shield)
      })
  })
})
