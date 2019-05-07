import {createTestAppContainer} from "../../../inversify.config"
import {Item} from "../../../item/model/item"
import {RequestType} from "../../../request/requestType"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"

let testRunner: TestRunner
let mobBuilder: MobBuilder
let item: Item

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  item = testRunner.createItem().asSatchel().build()
  item.container.isOpen = false
  mobBuilder = testRunner.createMob()
  mobBuilder.addItem(item)
})

describe("open action", () => {
  it("should be able to open item containers", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Open, "open satchel")

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe("you open a small leather satchel.")
    expect(response.message.getMessageToObservers())
      .toBe(`${mobBuilder.getMobName()} opens a small leather satchel.`)
    expect(item.container.isOpen).toBeTruthy()
  })

  it("should not be able to open a container that's already open", async () => {
    // given
    item.container.isOpen = true

    // when
    const response = await testRunner.invokeAction(RequestType.Open, "open satchel")

    // then
    expect(response.isError()).toBeTruthy()
    expect(response.getMessageToRequestCreator()).toBe("That has already open.")
  })
})
