import {AffectType} from "../../../affect/enum/affectType"
import {createTestAppContainer} from "../../../app/factory/testFactory"
import { RequestType } from "../../../request/enum/requestType"
import { ResponseStatus } from "../../../request/enum/responseStatus"
import {format} from "../../../support/string"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"
import {MESSAGE_REMOVE_FAIL} from "../../constants"

let testRunner: TestRunner
let mobBuilder: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mobBuilder = await testRunner.createMob()
})

describe("remove", () => {
  it("can remove an equipped item", async () => {
    // given
    const item = testRunner.createItem()
      .asHelmet()
      .build()
    mobBuilder.equip(item)

    // when
    const response = await testRunner.invokeAction(
        RequestType.Remove,
        `remove ${item.name}`)

    // then
    expect(response.status).toBe(ResponseStatus.Info)
    expect(response.getMessageToRequestCreator()).toContain("you remove")
  })

  it("should not work if an item is not equipped", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Remove, "remove foo")

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_REMOVE_FAIL)
  })

  it("should be successful if the item is equipped", async () => {
    // given
    const item = testRunner.createWeapon().asMace().build()
    mobBuilder.equip(item)

    // when
    const response = await testRunner.invokeAction(RequestType.Remove, `remove '${item.name}'`)

    // then
    expect(response.status).toBe(ResponseStatus.Info)
    expect(response.getMessageToRequestCreator())
      .toBe(`you remove ${item.name} and put it in your inventory.`)
    expect(response.message.getMessageToTarget())
      .toBe(`you remove ${item.name} and put it in your inventory.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${mobBuilder.getMobName()} removes ${item.name} and puts it in their inventory.`)
  })

  it("cannot remove cursed items", async () => {
    // given
    const item = testRunner.createWeapon().asMace().addAffect(AffectType.Curse).build()
    mobBuilder.equip(item)

    // when
    const response = await testRunner.invokeAction(RequestType.Remove, "remove mace")

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator())
      .toBe(format(ConditionMessages.All.Item.CannotRemoveCursedItem, item.toString()))
  })

  it("cannot remove no-remove items", async () => {
    // given
    const item = testRunner.createWeapon().asMace().addAffect(AffectType.NoRemove).build()
    mobBuilder.equip(item)

    // when
    const response = await testRunner.invokeAction(RequestType.Remove, "remove mace")

    // then
    expect(response.isSuccessful()).toBeFalsy()
    expect(response.getMessageToRequestCreator())
      .toBe(format(ConditionMessages.All.Item.NoRemoveItem, item.toString()))
  })
})
