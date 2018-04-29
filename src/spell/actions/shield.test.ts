import { AffectType } from "../../affect/affectType"
import { newSpell } from "../../mob/factory"
import { createCastRequest } from "../../server/request/factory"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import reset from "../../test/reset"
import { Check } from "../check"
import spellCollection from "../spellCollection"
import { SpellType } from "../spellType"

beforeEach(() => reset())

describe("shield", () => {
  it("should apply shield to the target, per the caster's level", () => {
    // setup
    const player = getTestPlayer()
    const mob = player.sessionMob
    const room = mob.room
    const target = getTestMob()
    const spellDefinition = spellCollection.findSpell(SpellType.Shield)
    target.name = "alice"
    mob.level = 20
    mob.spells.push(newSpell(SpellType.Shield, 5))
    room.addMob(target)
    const check = new Check(createCastRequest(player, "cast shield alice"), spellDefinition, () => true)

    // when
    spellDefinition.apply(check)

    // then
    expect(target.affects.length).toBe(1)
    const affect = target.affects[0]
    expect(affect.affectType).toBe(AffectType.Shield)
    expect(affect.mob).toBe(target)
    expect(mob.vitals.mana).toBe(mob.getCombinedAttributes().vitals.mana - spellDefinition.manaCost)
  })
})
