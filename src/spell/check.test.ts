import { MAX_PRACTICE_LEVEL } from "../mob/constants"
import { addFight, Fight } from "../mob/fight/fight"
import { createCastRequest } from "../request/factory"
import { Request } from "../request/request"
import { getTestMob } from "../test/mob"
import { getTestPlayer } from "../test/player"
import { Check} from "./check"
import { MESSAGE_NO_SPELL, MESSAGE_NOT_ENOUGH_MANA } from "./constants"
import { newSpell } from "./factory"
import spellTable from "./spellTable"
import { SpellType } from "./spellType"

function getTestSpell() {
  return newSpell(SpellType.MagicMissile)
}

function createTestCastRequest(input: string): Request {
  return createCastRequest(getTestPlayer(), input)
}

const TEST_INPUT_CURE = "cast cure"
const TEST_INPUT_MM = "cast magic missile"
const TEST_INPUT_STRENGTH = "cast giant strength"

describe("spell check", () => {
  it("should error out if a mob is casting a spell it does not know", () => {
    const check = new Check(
      createTestCastRequest(TEST_INPUT_CURE),
      spellTable.findSpell(SpellType.CureLight),
    )

    expect(check.isError()).toBe(true)
    expect(check.isFailure()).toBe(false)
    expect(check.isSuccessful()).toBe(false)
    expect(check.fail).toBe(MESSAGE_NO_SPELL)
  })

  it("must specify a target for offensive spells if not in a fight", () => {
    expect(
      new Check(
        createTestCastRequest(TEST_INPUT_MM),
        spellTable.findSpell(SpellType.MagicMissile)).isError()).toBe(true)
  })

  it("does not need a target for offensive spells when in a fight already", () => {
    // Setup
    const player = getTestPlayer()
    const target = getTestMob()
    player.sessionMob.spells.push(getTestSpell())
    addFight(new Fight(player.sessionMob, target, player.sessionMob.room))

    expect(
      new Check(
        createCastRequest(player, TEST_INPUT_MM),
        spellTable.findSpell(SpellType.MagicMissile)).isError()).toBe(false)
  })

  it("should not be able to cast if mana is not sufficient", () => {
    // Setup
    const player = getTestPlayer()
    player.sessionMob.vitals.mana = 1
    player.sessionMob.spells.push(newSpell(SpellType.GiantStrength, MAX_PRACTICE_LEVEL))
    const check = new Check(
      createCastRequest(player, TEST_INPUT_STRENGTH),
      spellTable.findSpell(SpellType.GiantStrength))

    // Expect
    expect(check.isSuccessful()).toBe(false)
    expect(check.fail).toBe(MESSAGE_NOT_ENOUGH_MANA)
  })
})
