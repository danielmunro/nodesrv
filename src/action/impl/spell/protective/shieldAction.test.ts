import {AffectType} from "../../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {SpellType} from "../../../../mob/spell/spellType"
import {RequestType} from "../../../../request/enum/requestType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

describe("shield spell action", () => {
  it("should shield when casted", async () => {
    // setup
    const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
    const mob = await testRunner.createMob()
    mob.withSpell(SpellType.Shield, MAX_PRACTICE_LEVEL)
      .setLevel(30)
    const target = await testRunner.createMob()

    // when
    await testRunner.invokeActionSuccessfully(RequestType.Cast, "cast shield bob", target.get())

    // then
    expect(target.mob.affect().has(AffectType.Shield)).toBeTruthy()
  })
})
