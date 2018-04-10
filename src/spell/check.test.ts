import { RequestType } from "../handler/constants"
import { addFight, Fight } from "../mob/fight/fight"
import { Request } from "../server/request/request"
import { getTestMob } from "../test/mob"
import { getTestPlayer } from "../test/player"
import { Check, MESSAGE_NO_SPELL } from "./check"
import { Spell } from "./model/spell"
import spellCollection from "./spellCollection"
import { SpellType } from "./spellType"

function getTestSpell() {
  const mm = new Spell()
  mm.spellType = SpellType.MagicMissile
  mm.level = 1

  return mm
}

describe("spell check", () => {
  it("should error out if a mob is casting a spell it does not know", () => {
    const check = new Check(
      new Request(getTestPlayer(), RequestType.Cast, {request: "cast cure"}),
      spellCollection.findSpell(SpellType.CureLight),
    )

    expect(check.isError()).toBe(true)
    expect(check.isFailure()).toBe(false)
    expect(check.isSuccessful()).toBe(false)
    expect(check.fail).toBe(MESSAGE_NO_SPELL)
  })

  it("must specify a target for offensive spells if not in a fight", () => {
    expect(
      new Check(
        new Request(getTestPlayer(), RequestType.Cast, {request: "cast magic missile"}),
        spellCollection.findSpell(SpellType.MagicMissile)).isError()).toBe(true)
  })

  it("does not need a target for offensive spells when in a fight already", () => {
    // Setup
    const player = getTestPlayer()
    const target = getTestMob()
    player.sessionMob.spells.push(getTestSpell())
    addFight(new Fight(player.sessionMob, target))

    expect(
      new Check(
        new Request(player, RequestType.Cast, {request: "cast magic missile"}),
        spellCollection.findSpell(SpellType.MagicMissile)).isError()).toBe(false)
  })

  it("gets an appropriate delay on cast failure", () => {
    // Setup
    const player = getTestPlayer()
    const target = getTestMob()
    const magicMissile = spellCollection.findSpell(SpellType.MagicMissile)
    player.sessionMob.spells.push(getTestSpell())
    addFight(new Fight(player.sessionMob, target))
    const check = new Check(
      new Request(player, RequestType.Cast, {request: "cast magic missile"}),
      magicMissile)

    // Expect
    expect(check.isError()).toBe(false)
    expect(check.isFailure()).toBe(true)
    expect(player.delay).toBe(0)

    // Given
    magicMissile.apply(check)

    // Then
    expect(player.delay).toBeGreaterThan(0)
  })

  it("should be able to successfully cast and receive a delay", () => {
    // Setup
    const player = getTestPlayer()
    const target = getTestMob()
    const magicMissile = spellCollection.findSpell(SpellType.MagicMissile)
    const testSpell = getTestSpell()
    testSpell.level = 100
    player.sessionMob.spells.push(testSpell)
    addFight(new Fight(player.sessionMob, target))
    const request = new Request(player, RequestType.Cast, {request: "cast magic missile"})

    expect.assertions(3)
    return Promise.resolve([
      new Check(request, magicMissile),
      new Check(request, magicMissile),
      new Check(request, magicMissile),
      new Check(request, magicMissile),
      new Check(request, magicMissile),
    ]).then((checks) => {
      const successCheck = checks.find((c) => c.isSuccessful())

      // Expect
      expect(successCheck).toBeTruthy()
      expect(player.delay).toBe(0)

      // Given
      magicMissile.apply(successCheck)

      // Then
      expect(player.delay).toBeGreaterThan(0)
    })
  })
})
