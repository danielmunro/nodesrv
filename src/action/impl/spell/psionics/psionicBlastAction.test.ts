import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import {RequestType} from "../../../../request/enum/requestType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let defender: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  const mob = await testRunner.createMob()
  mob.withSpell(SpellType.PsionicBlast, MAX_PRACTICE_LEVEL)
  defender = await testRunner.createMob()
})

describe("psionic blast spell action", () => {
  it("generates successful messages", async () => {
    const response = await testRunner.invokeActionSuccessfully(
        RequestType.Cast,
        `cast psionic '${defender.getMobName()}'`,
        defender.mob)

    expect(response.getMessageToRequestCreator())
      .toBe(`${defender.getMobName()} is shattered by a psionic blast.`)
    expect(response.getMessageToTarget())
      .toBe("you are shattered by a psionic blast.")
    expect(response.getMessageToObservers())
      .toBe(`${defender.getMobName()} is shattered by a psionic blast.`)
  })
})
