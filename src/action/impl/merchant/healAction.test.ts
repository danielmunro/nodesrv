import {createTestAppContainer} from "../../../app/factory/testFactory"
import {MAX_PRACTICE_LEVEL} from "../../../mob/constants"
import {RequestType} from "../../../request/enum/requestType"
import {SpellType} from "../../../spell/spellType"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
let healer: MobBuilder
let mobBuilder: MobBuilder
const initialGold = 100

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mobBuilder = testRunner.createMob().setGold(initialGold)
  healer = testRunner.createMob()
    .asHealer()
    .withSpell(SpellType.CureLight, MAX_PRACTICE_LEVEL)
})

describe("healer action", () => {
  it("can describe spells for sale", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Heal)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${healer.getMobName()} offers the following spells:
cure light - 10 gold
Type heal [spell] to be healed`)
  })

  it("can cure light", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Heal, "heal cure")

    // then
    expect(response.getMessageToRequestCreator()).toBe(`${mobBuilder.getMobName()} feels better!`)
    expect(response.message.getMessageToTarget()).toBe(`you feel better!`)
    expect(response.message.getMessageToObservers()).toBe(`${mobBuilder.getMobName()} feels better!`)

    // and
    expect(mobBuilder.mob.gold).toBeLessThan(initialGold)
  })

  it("fails if cannot be afforded", async () => {
    // given
    mobBuilder.setGold(0)

    // when
    const response = await testRunner.invokeAction(RequestType.Heal, "heal cure")

    // then
    expect(response.getMessageToRequestCreator()).toBe("You can't afford that.")
    expect(response.isError()).toBeTruthy()
  })

  it("fails if requesting not a spell", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Heal, "heal foo")

    // then
    expect(response.getMessageToRequestCreator()).toBe("They don't know that spell.")
    expect(response.isError()).toBeTruthy()
  })
})
