import {createTestAppContainer} from "../../../../app/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/enum/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let defender: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  testRunner.createMob()
    .withSpell(SpellType.PsionicBlast, MAX_PRACTICE_LEVEL)
  defender = testRunner.createMob()
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
