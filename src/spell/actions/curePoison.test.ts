import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { newSpell } from "../factory"
import { getTestPlayer } from "../../test/player"
import { Check } from "../check"
import spellCollection from "../spellCollection"
import { SpellType } from "../spellType"
import curePoison from "./curePoison"
import { MaxPracticeLevel } from "../../mob/model/mob"

describe("cure poison", () => {
  it("should be able to cure poison", () => {
    const player = getTestPlayer()
    player.sessionMob.addAffect(newAffect(AffectType.Poison, 1))
    player.sessionMob.spells.push(newSpell(SpellType.CurePoison, MaxPracticeLevel))

    curePoison(
      new Check(
        new Request(player, RequestType.Cast, "cast 'cure poison'"),
        spellCollection.findSpell(SpellType.CurePoison)))

    expect(player.sessionMob.affects.length).toBe(0)
  })
})
