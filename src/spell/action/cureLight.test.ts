import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import getSpellTable from "../spellTable"
import { SpellType } from "../spellType"

const TO_TARGET = "you feel better!"

describe("cure light", () => {
  it("should heal a target when casted", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder1 = testBuilder.withMob()
    mobBuilder1.withSpell(SpellType.CureLight, MAX_PRACTICE_LEVEL)
    const mobBuilder2 = testBuilder.withMob("bob")
    const mob = mobBuilder2.mob
    mob.vitals.hp = 1
    const definition = getSpellTable(await testBuilder.getService()).findSpell(SpellType.CureLight)

    // when
    const response = await definition.doAction(testBuilder.createRequest(RequestType.Cast, "cast cure bob", mob))

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(response.message.getMessageToRequestCreator()).toBe("bob feels better!")
    expect(response.message.getMessageToTarget()).toBe(TO_TARGET)
    expect(response.message.getMessageToObservers()).toBe("bob feels better!")
    expect(mob.vitals.hp).toBeGreaterThan(1)
  })

  it("should heal self casted", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder1 = testBuilder.withMob("alice")
    mobBuilder1.withSpell(SpellType.CureLight, MAX_PRACTICE_LEVEL)
    const mob = mobBuilder1.mob
    mob.vitals.hp = 1
    const definition = getSpellTable(await testBuilder.getService()).findSpell(SpellType.CureLight)

    // when
    const response = await definition.doAction(testBuilder.createRequest(RequestType.Cast, "cast cure", mob))

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(response.message.getMessageToRequestCreator()).toBe(TO_TARGET)
    expect(response.message.getMessageToTarget()).toBe(TO_TARGET)
    expect(response.message.getMessageToObservers()).toBe("alice feels better!")
    expect(mob.vitals.hp).toBeGreaterThan(1)
  })
})
