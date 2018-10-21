import { AffectType } from "../../affect/affectType"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { Check } from "../check"
import spellTable from "../spellTable"
import { SpellType } from "../spellType"
import poison from "./poison"

describe("poison", () => {
  it("casting poison should add the poison affect to the target", async () => {
    // setup
    const mobName = "bob"
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withSpell(SpellType.Poison, MAX_PRACTICE_LEVEL)
    const target = testBuilder.withMob(mobName).mob

    poison(new Check(
      testBuilder.createRequest(RequestType.Cast, "cast poison bob", target),
      spellTable.findSpell(SpellType.Poison)))

    expect(target.affects.length).toBe(1)
    expect(target.getAffect(AffectType.Poison)).toBeTruthy()
  })
})
