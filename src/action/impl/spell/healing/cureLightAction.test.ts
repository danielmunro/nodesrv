import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {Mob} from "../../../../mob/model/mob"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import doNTimes from "../../../../support/functional/times"
import MobBuilder from "../../../../test/mobBuilder"
import TestBuilder from "../../../../test/testBuilder"
import Spell from "../../../spell"

let testBuilder: TestBuilder
let mobBuilder: MobBuilder
let mob: Mob
let spell: Spell
const iterations = 10

beforeEach(async () => {
  testBuilder = new TestBuilder()
  mobBuilder = testBuilder.withMob("alice")
  mobBuilder.withLevel(20)
  mobBuilder.withSpell(SpellType.CureLight, MAX_PRACTICE_LEVEL)
  mob = testBuilder.withMob("bob").mob
  spell = await testBuilder.getSpellDefinition(SpellType.CureLight)
})

describe("cure light", () => {
  it("should heal a target when casted", async () => {
    // setup
    mob.vitals.hp = 1

    // when
    const responses = await doNTimes(
      iterations,
      () => spell.handle(testBuilder.createRequest(RequestType.Cast, "cast cure bob", mob)))

    // then
    const response = responses.find(r => r.isSuccessful())
    expect(response).toBeDefined()
    expect(mob.vitals.hp).toBeGreaterThan(1)
  })

  it("should heal self when casted", async () => {
    // setup
    mob.level = 30
    mob.vitals.hp = 1

    // when
    const responses = await doNTimes(
      iterations,
      () => spell.handle(testBuilder.createRequest(RequestType.Cast, "cast cure", mob)))

    // then
    const response = responses.find(r => r.isSuccessful())
    expect(response).toBeDefined()
    expect(mob.vitals.hp).toBeGreaterThan(1)
  })
})
