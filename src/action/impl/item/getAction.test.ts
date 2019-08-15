import {createTestAppContainer} from "../../../app/factory/testFactory"
import { RequestType } from "../../../messageExchange/enum/requestType"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"
import {MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE} from "../../constants"

let testRunner: TestRunner
let mobBuilder: MobBuilder

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mobBuilder = await testRunner.createMob()
})

describe("get action", () => {
  it("should be able to get an item from a room inventory", async () => {
    // given
    const item = testRunner.createItem()
      .asHelmet()
      .build()

    // when
    const response = await testRunner.invokeAction(RequestType.Get, `get '${item.name}'`)

    // then
    expect(response.getMessageToRequestCreator()).toContain("you pick up a baseball cap")
    expect(response.message.getMessageToObservers()).toContain(`${mobBuilder.getMobName()} picks up a baseball cap`)
    expect(mobBuilder.getItems()).toHaveLength(1)
  })

  it("should be able to get an item from a container", async () => {
    // setup
    const food = testRunner.createItem()
      .asFood()
      .build()
    const satchel = testRunner.createItem()
      .asSatchel()
      .addItemToContainerInventory(food)
      .build()
    mobBuilder.addItem(satchel)

    // when
    const response = await testRunner.invokeAction(RequestType.Get, "get pretzel satchel")

    // then
    expect(response.getMessageToRequestCreator())
      .toContain(`you get ${food.name} from ${satchel.name}`)
    expect(response.message.getMessageToObservers())
      .toContain(`${mobBuilder.getMobName()} gets ${food.name} from ${satchel.name}`)
    expect(mobBuilder.getItems()).toHaveLength(2)
  })

  it("should not work if the item specified does not exist", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Get, "get foo")

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.All.Item.NotFound)
  })

  it("should not be able to get an item that is not transferable", async () => {
    // setup
    testRunner.createItem()
      .asHelmet()
      .notTransferrable()
      .build()

    // when
    const response = await testRunner.invokeAction(RequestType.Get, "get baseball")

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe(MESSAGE_FAIL_ITEM_NOT_TRANSFERABLE)
  })
})
