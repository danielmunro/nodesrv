import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { RequestType } from "../../handler/constants"
import { createRequestArgs, Request } from "../../request/request"
import { newSpell } from "../../spell/factory"
import { getTestPlayer } from "../../test/player"
import { Check } from "../check"
import spellCollection from "../spellCollection"
import { SpellType } from "../spellType"
import curePoison from "./curePoison"

describe("cure poison", () => {
  it("should be able to cure poison", () => {
    const player = getTestPlayer()
    player.sessionMob.addAffect(newAffect(AffectType.Poison, 1))
    player.sessionMob.spells.push(newSpell(SpellType.CurePoison, 100))

    curePoison(
      new Check(
        new Request(player, RequestType.Cast, createRequestArgs("cast 'cure poison'")),
        spellCollection.findSpell(SpellType.CurePoison)))

    expect(player.sessionMob.affects.length).toBe(0)
  })
})
