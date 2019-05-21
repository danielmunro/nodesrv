import {createTestAppContainer} from "../../../app/factory/testFactory"
import {Item} from "../../../item/model/item"
import {RequestType} from "../../../request/enum/requestType"
import {ResponseStatus} from "../../../request/enum/responseStatus"
import MobBuilder from "../../../support/test/mobBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {ConditionMessages} from "../../constants"

let testRunner: TestRunner
let mobBuilder: MobBuilder
let item: Item
const closeCommand = "close satchel"

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  item = testRunner.createItem().asSatchel().build()
  item.container.isOpen = true
  item.container.isCloseable = true
  mobBuilder = testRunner.createMob().addItem(item)
})

describe("close action", () => {
  it("should be able to close item containers", async () => {
    // when
    const response = await testRunner.invokeAction(RequestType.Close, closeCommand)

    // then
    expect(response.getMessageToRequestCreator()).toBe(`you close ${item.name}.`)
    expect(response.message.getMessageToObservers()).toBe(`${mobBuilder.getMobName()} closes ${item.name}.`)
    expect(item.container.isOpen).toBeFalsy()
    expect(response.status).toBe(ResponseStatus.Success)
  })

  it("should not be able to close uncloseable item containers", async () => {
    // given
    item.container.isCloseable = false

    // when
    const response = await testRunner.invokeAction(RequestType.Close, closeCommand)

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Close.Fail.CannotClose)
    expect(item.container.isOpen).toBeTruthy()
  })

  it("should not be able to close a container that's already closed", async () => {
    // given
    item.container.isOpen = false

    // when
    const response = await testRunner.invokeAction(RequestType.Close, closeCommand)

    // then
    expect(response.status).toBe(ResponseStatus.PreconditionsFailed)
    expect(response.getMessageToRequestCreator()).toBe("That has already closed.")
  })
})
