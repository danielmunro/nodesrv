import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestBuilder from "../../../../support/test/testBuilder"

let testBuilder: TestBuilder
let attacker: MobBuilder
let defender: MobBuilder

beforeEach(() => {
  testBuilder = new TestBuilder()
  attacker = testBuilder.withMob()
    .withSpell(SpellType.PsionicBlast, MAX_PRACTICE_LEVEL)
  defender = testBuilder.withMob()
})

describe("psionic blast spell action", () => {
  it("generates successful messages", async () => {
    const response = await testBuilder.successfulAction(
      testBuilder.createRequest(
        RequestType.Cast,
        `cast psionic '${defender.getMobName()}'`,
        defender.mob))

    expect(response.getMessageToRequestCreator())
      .toBe(`${defender.getMobName()} is shattered by a psionic blast.`)
    expect(response.message.getMessageToTarget())
      .toBe("you are shattered by a psionic blast.")
    expect(response.message.getMessageToObservers())
      .toBe(`${defender.getMobName()} is shattered by a psionic blast.`)
  })
})
