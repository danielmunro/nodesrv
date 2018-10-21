import { AffectType } from "../../affect/affectType"
import { newAffect } from "../../affect/factory"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import InputContext from "../../request/context/inputContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestPlayer } from "../../test/player"
import { Check } from "../check"
import { newSpell } from "../factory"
import spellTable from "../spellTable"
import { SpellType } from "../spellType"
import curePoison from "./curePoison"

describe("cure poison", () => {
  it("should be able to cure poison", () => {
    const player = getTestPlayer()
    player.sessionMob.addAffect(newAffect(AffectType.Poison, 1))
    player.sessionMob.spells.push(newSpell(SpellType.CurePoison, MAX_PRACTICE_LEVEL))

    curePoison(
      new Check(
        new Request(player.sessionMob, new InputContext(RequestType.Cast, "cast 'cure poison'")),
        spellTable.findSpell(SpellType.CurePoison)))

    expect(player.sessionMob.affects.length).toBe(0)
  })
})
