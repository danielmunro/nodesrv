import { addFight, Fight } from "../mob/fight/fight"
import { createCastRequest } from "../request/factory"
import { Request } from "../request/request"
import { getTestMob } from "../test/mob"
import { getTestPlayer } from "../test/player"
import { Check, MESSAGE_NO_SPELL, MESSAGE_NOT_ENOUGH_MANA } from "./check"
import { newSpell } from "./factory"
import spellCollection from "./spellCollection"
import { SpellType } from "./spellType"

function getTestSpell() {
  return newSpell(SpellType.MagicMissile)
}

function createTestCastRequest(input: string): Request {
  return createCastRequest(getTestPlayer(), input)
}

describe("spell check", () => {
  it("should error out if a mob is casting a spell it does not know", () => {
    const check = new Check(
      createTestCastRequest("cast cure"),
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
        createTestCastRequest("cast magic missile"),
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
        createCastRequest(player, "cast magic missile"),
        spellCollection.findSpell(SpellType.MagicMissile)).isError()).toBe(false)
  })

  it("gets an appropriate delay on cast failure", () => {
    // Setup
    const player = getTestPlayer()
    const target = getTestMob()
    const magicMissile = spellCollection.findSpell(SpellType.MagicMissile)
    player.sessionMob.spells.push(getTestSpell())
    addFight(new Fight(player.sessionMob, target))
    const check = new Check(createCastRequest(player, "cast magic missile"), magicMissile, () => false)

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
    player.sessionMob.spells.push(newSpell(SpellType.MagicMissile, 100))
    addFight(new Fight(player.sessionMob, target))
    const request = createCastRequest(player, "cast magic missile")

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

  it("should not be able to cast if mana is not sufficient", () => {
    // Setup
    const player = getTestPlayer()
    player.sessionMob.vitals.mana = 1
    player.sessionMob.spells.push(newSpell(SpellType.GiantStrength, 100))
    const check = new Check(
      createCastRequest(player, "cast giant strength"),
      spellCollection.findSpell(SpellType.GiantStrength))

    // Expect
    expect(check.isSuccessful()).toBe(false)
    expect(check.fail).toBe(MESSAGE_NOT_ENOUGH_MANA)
  })
})
