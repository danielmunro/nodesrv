import { MAX_PRACTICE_LEVEL } from "../../../../mob/constants"
import {Mob} from "../../../../mob/model/mob"
import { RequestType } from "../../../../request/requestType"
import { SpellType } from "../../../../spell/spellType"
import {getSuccessfulAction} from "../../../../support/functional/times"
import TestBuilder from "../../../../support/test/testBuilder"
import Spell from "../../spell"

let testBuilder: TestBuilder
let spell: Spell
let target: Mob

beforeEach(async () => {
  testBuilder = new TestBuilder()
  const mobBuilder1 = testBuilder.withMob()
  mobBuilder1.setLevel(30)
  mobBuilder1.withSpell(SpellType.MagicMissile, MAX_PRACTICE_LEVEL)
  const mobBuilder2 = testBuilder.withMob()
  target = mobBuilder2.mob
  spell = await testBuilder.getSpell(SpellType.MagicMissile)
})

describe("magic missile", () => {
  it("does damage when casted", async () => {
    // when
    await getSuccessfulAction(
      spell, testBuilder.createRequest(RequestType.Cast, `cast magic ${target.name}`, target))

    // then
    const attr = target.attribute()
    expect(attr.getHp()).toBeLessThan(attr.getMaxHp())
  })
})
