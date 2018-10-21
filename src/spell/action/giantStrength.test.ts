import { AffectType } from "../../affect/affectType"
import InputContext from "../../request/context/inputContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import reset from "../../test/reset"
import { Check } from "../check"
import { newSpell } from "../factory"
import spellCollection from "../spellCollection"
import { SpellType } from "../spellType"

beforeEach(() => reset())

describe("giant strength", () => {
  it("should apply giant strength to the target, per the caster's giant strength level", () => {
    // setup
    const player = getTestPlayer()
    const mob = player.sessionMob
    const room = mob.room
    const target = getTestMob()
    const spellDefinition = spellCollection.findSpell(SpellType.GiantStrength)
    target.name = "alice"
    mob.level = 20
    mob.spells.push(newSpell(SpellType.GiantStrength, 5))
    room.addMob(target)
    const check = new Check(
      new Request(player.sessionMob, new InputContext(RequestType.Cast, "cast giant strength alice"), target),
      spellDefinition,
      () => true)

    // when
    spellDefinition.apply(check)

    // then
    expect(target.affects.length).toBe(1)
    const affect = target.affects[0]
    expect(affect.affectType).toBe(AffectType.GiantStrength)
    expect(affect.mob).toBe(target)
    expect(mob.vitals.mana).toBe(mob.getCombinedAttributes().vitals.mana - spellDefinition.manaCost)
  })
})
