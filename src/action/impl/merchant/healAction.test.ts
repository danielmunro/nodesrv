import {MAX_PRACTICE_LEVEL} from "../../../mob/constants"
import {Mob} from "../../../mob/model/mob"
import {RequestType} from "../../../request/requestType"
import {newSpell} from "../../../spell/factory"
import {SpellType} from "../../../spell/spellType"
import {getSuccessfulAction} from "../../../support/functional/times"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

let testBuilder: TestBuilder
let action: Action
let healer: Mob
let mob: Mob

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getActionDefinition(RequestType.Heal)
  mob = testBuilder.withMob().mob
  mob.gold = 100
  healer = testBuilder.withMob().mob
  healer.traits.healer = true
  healer.spells.push(newSpell(SpellType.CureLight, MAX_PRACTICE_LEVEL))
})

describe("healer action", () => {
  it("can cure light", async () => {
    // when
    const response = await getSuccessfulAction(action, testBuilder.createRequest(RequestType.Heal, "heal cure"))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(`${mob.name} feels better!`)
    expect(response.message.getMessageToTarget()).toBe(`you feel better!`)
    expect(response.message.getMessageToObservers()).toBe(`${mob.name} feels better!`)
  })
})
