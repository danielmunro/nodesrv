import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {ItemEntity} from "../../../../item/entity/itemEntity"
import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {ConditionMessages} from "../../../../mob/skill/constants"
import {SkillType} from "../../../../mob/skill/skillType"
import {RequestType} from "../../../../request/enum/requestType"
import MobBuilder from "../../../../support/test/mobBuilder"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"

let testRunner: TestRunner
let item: ItemEntity
let mobBuilder: MobBuilder
const input = "repair axe"

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mobBuilder = (await testRunner.createMob())
    .withSkill(SkillType.Repair, MAX_PRACTICE_LEVEL)
  mobBuilder.addItem(testRunner.createWeapon()
    .asMace()
    .build())
  item = testRunner.createWeapon()
    .asAxe()
    .build()
  mobBuilder.addItem(item)
    .setLevel(30)
})

describe("repair action", () => {
  it("improves an item's condition", async () => {
    // given
    item.condition = 0

    // when
    await testRunner.invokeActionSuccessfully(RequestType.Repair, input)

    // then
    expect(item.condition).toBeGreaterThan(0)
  })

  it("does not improve above 100", async () => {
    // given
    item.condition = 99

    // when
    await testRunner.invokeActionSuccessfully(RequestType.Repair, input)

    // then
    expect(item.condition).toBe(100)
  })

  it("does not allow repairing if already at 100", async () => {
    // given
    item.condition = 100

    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Repair, input)

    // then
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Repair.ItemAlreadyInGoodCondition)
  })

  it("requires an item", async () => {
    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Repair, "repair foobar")

    // then
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.NoItem)
  })

  it("requires the item to be equipment", async () => {
    // given
    const anotherItem = testRunner.createItem().asKey().build()
    mobBuilder.addItem(anotherItem)

    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Repair, "repair key")

    // then
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Repair.ItemNotEquipment)
  })

  it("generates correct success messages", async () => {
    // given
    item.condition = 0

    // when
    const response = await testRunner.invokeActionSuccessfully(RequestType.Repair, input)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe("you repair a wood chopping axe, restoring its durability.")
    expect(response.getMessageToTarget())
      .toBe("you repair a wood chopping axe, restoring its durability.")
    expect(response.getMessageToObservers())
      .toBe(`${mobBuilder.getMobName()} repairs a wood chopping axe, restoring its durability.`)
  })

  it("generates correct failure messages", async () => {
    // given
    item.condition = 0
    mobBuilder.mob.skills[0].level = 1

    // when
    const response = await testRunner.invokeActionFailure(RequestType.Repair, input)

    // then
    expect(response.getMessageToRequestCreator())
      .toBe("you fail to repair a wood chopping axe.")
    expect(response.getMessageToTarget())
      .toBe("you fail to repair a wood chopping axe.")
    expect(response.getMessageToObservers())
      .toBe(`${mobBuilder.getMobName()} fails to repair a wood chopping axe.`)
  })
})
