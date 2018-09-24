import { AffectType } from "../../affect/affectType"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import { getTestRoom } from "../../test/room"
import TestBuilder from "../../test/testBuilder"
import { Check } from "../check"
import spellCollection from "../spellCollection"
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
      spellCollection.findSpell(SpellType.Poison)))

    expect(target.affects.length).toBe(1)
    expect(target.getAffect(AffectType.Poison)).toBeTruthy()
  })
})
