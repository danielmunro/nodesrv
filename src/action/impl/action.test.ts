import {createTestAppContainer} from "../../app/factory/testFactory"
import InputContext from "../../messageExchange/context/inputContext"
import { RequestType } from "../../messageExchange/enum/requestType"
import Request from "../../messageExchange/request"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import ActionService from "../service/actionService"
import Action from "./action"

let action: Action
let testRunner: TestRunner

beforeEach(async () => {
  const app = await createTestAppContainer()
  action = app.get<ActionService>(Types.ActionService).actions.find(a =>
    a.getRequestType() === RequestType.Noop) as Action
  testRunner = app.get<TestRunner>(Types.TestRunner)
})

describe("Action", () => {
  it("isAbleToHandleRequestType should only handle its own request type", async () => {
    expect(action.isAbleToHandleRequestType(RequestType.Gossip)).toBe(false)
    expect(action.isAbleToHandleRequestType(RequestType.Noop)).toBe(true)
  })

  it("applyCallback should fail on different request types", async () => {
    await expect(action.handle(
      new Request((await testRunner.createMob()).get(), null as any, new InputContext(RequestType.Gossip))))
      .rejects.toThrowError("request type mismatch")
  })

  it("applyCallback should succeed on matching request types", async () => {
    const callback = jest.fn()
    action.handle(
      new Request((await testRunner.createMob()).get(), null as any, new InputContext(RequestType.Noop)))
      .then(callback)
      .then(() => expect(callback).toBeCalled())
  })
})
