import { RequestType } from "../handler/constants"
import { addFight, Fight } from "../mob/fight/fight"
import { Spell } from "../mob/model/spell"
import { Request } from "../server/request/request"
import { getTestMob } from "../test/mob"
import { getTestPlayer } from "../test/player"
import { Check } from "./check"
import spellCollection from "./spellCollection"
import { SpellType } from "./spellType"

describe("spell check", () => {
  it("should error out if a mob is casting a spell it does not know", () => {
    const check = new Check(
      new Request(getTestPlayer(), RequestType.Cast, {request: "cast shield"}),
      spellCollection[0],
    )

    expect(check.isError()).toBe(true)
    expect(check.isFailure()).toBe(false)
    expect(check.isSuccessful()).toBe(false)
  })

  it("must specify a target for offensive spells if not in a fight", () => {
    expect(
      new Check(
        new Request(getTestPlayer(), RequestType.Cast, {request: "cast magic missile"}),
        spellCollection[1]).isError()).toBe(true)
  })

  it("does not need a target for offensive spells when in a fight already", () => {
    const player = getTestPlayer()
    const target = getTestMob()
    const mm = new Spell()
    mm.spellType = SpellType.MagicMissile
    mm.mob = player.sessionMob
    mm.level = 1
    player.sessionMob.spells.push(mm)
    addFight(new Fight(player.sessionMob, target))
    expect(
      new Check(
        new Request(player, RequestType.Cast, {request: "cast magic missile"}),
        spellCollection[0]).isError()).toBe(false)
  })
})
