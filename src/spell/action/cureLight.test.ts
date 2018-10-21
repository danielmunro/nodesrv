import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { createCastRequest } from "../../request/factory"
import { getTestPlayer } from "../../test/player"
import { Check } from "../check"
import { newSpell } from "../factory"
import spellCollection from "../spellCollection"
import { SpellType } from "../spellType"
import cureLight from "./cureLight"

describe("cure light", () => {
  it("should restore a portion of hp", () => {
    // setup
    const player = getTestPlayer()
    player.sessionMob.spells.push(newSpell(SpellType.CureLight, MAX_PRACTICE_LEVEL))
    player.sessionMob.vitals.hp = 1

    // when
    cureLight(
      new Check(
        createCastRequest(player, "cast 'cure light'"),
        spellCollection.findSpell(SpellType.CureLight)))

    // then
    expect(player.sessionMob.vitals.hp).toBeGreaterThan(1)
  })
})
