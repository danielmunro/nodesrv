import {createTestAppContainer} from "../../../app/factory/testFactory"
import { RequestType } from "../../../request/enum/requestType"
import { ResponseStatus } from "../../../request/enum/responseStatus"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"

let testRunner: TestRunner
let mobBuilder: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mobBuilder = testRunner.createMob()
})

describe("wear action", () => {
  it("can equip an item", async () => {
    // given
    const item = testRunner.createItem()
      .asHelmet()
      .build()
    mobBuilder.addItem(item)

    // when
    const response = await testRunner.invokeAction(RequestType.Wear, `wear ${item.name}`)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.getMessageToRequestCreator()).toBe(`you wear ${item.name}.`)
    expect(response.message.getMessageToTarget()).toBe(`you wear ${item.name}.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${mobBuilder.getMobName()} wears ${item.name}.`)
  })

  it("will remove an equipped item and wear a new item", async () => {
    // given
    const item1 = testRunner.createItem()
      .asHelmet()
      .build()
    const item2 = testRunner.createItem()
      .asHelmet()
      .build()
    item2.name = "a pirate hat"
    mobBuilder.equip(item1)
    mobBuilder.addItem(item2)

    // when
    const response = await testRunner.invokeAction(RequestType.Wear, "wear hat")

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(response.getMessageToRequestCreator())
      .toBe(`you remove ${item1.name} and wear ${item2.name}.`)
    expect(response.message.getMessageToTarget())
      .toBe(`you remove ${item1.name} and wear ${item2.name}.`)
    expect(response.message.getMessageToObservers())
      .toBe(`${mobBuilder.getMobName()} removes ${item1.name} and wears ${item2.name}.`)
  })

  it("should not work if an item has not found", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Wear, "wear foo")

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Item.NotOwned)
  })

  it("can't equip things that aren't equipment", async () => {
    // setup
    const item = testRunner.createItem()
      .asFood()
      .build()
    mobBuilder.addItem(item)

    const response = await testRunner.invokeAction(RequestType.Wear, `wear ${item.name}`)

    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Item.NotEquipment)
  })
})
