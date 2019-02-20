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
const initialGold = 100

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getActionDefinition(RequestType.Heal)
  mob = testBuilder.withMob().mob
  mob.gold = initialGold
  healer = testBuilder.withMob().mob
  healer.traits.healer = true
  healer.spells.push(newSpell(SpellType.CureLight, MAX_PRACTICE_LEVEL))
})

describe("healer action", () => {
  it("can describe spells for sale", async () => {
    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Heal))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(`${healer.name} offers the following spells:
cure light - 10 gold
Type heal [spell] to be healed`)
  })

  it("can cure light", async () => {
    // when
    const response = await getSuccessfulAction(action, testBuilder.createRequest(RequestType.Heal, "heal cure"))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(`${mob.name} feels better!`)
    expect(response.message.getMessageToTarget()).toBe(`you feel better!`)
    expect(response.message.getMessageToObservers()).toBe(`${mob.name} feels better!`)

    // and
    expect(mob.gold).toBeLessThan(initialGold)
  })

  it("fails if cannot be afforded", async () => {
    // given
    mob.gold = 0

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Heal, "heal cure"))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe("You can't afford that.")
    expect(response.isError()).toBeTruthy()
  })

  it("fails if requesting not a spell", async () => {
    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Heal, "heal foo"))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe("They don't know that spell.")
    expect(response.isError()).toBeTruthy()
  })
})
