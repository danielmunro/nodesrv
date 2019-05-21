import {createTestAppContainer} from "../../app/testFactory"
import InputContext from "../../request/context/inputContext"
import { RequestType } from "../../request/enum/requestType"
import Request from "../../request/request"
import {Types} from "../../support/types"
import ActionService from "../service/actionService"
import Action from "./action"

let action: Action

beforeEach(async () => {
  const app = await createTestAppContainer()
  action = app.get<ActionService>(Types.ActionService).actions.find(a =>
    a.getRequestType() === RequestType.Noop) as Action
})

describe("Action", () => {
  it("isAbleToHandleRequestType should only handle its own request type", async () => {
    expect(action.isAbleToHandleRequestType(RequestType.Gossip)).toBe(false)
    expect(action.isAbleToHandleRequestType(RequestType.Noop)).toBe(true)
  })

  it("applyCallback should fail on different request types", async () => {
    await expect(action.handle(new Request(null, null, null)))
      .rejects.toThrowError()
  })

  it("applyCallback should succeed on matching request types", async () => {
    const callback = jest.fn()
    action.handle(new Request(null, null, new InputContext(RequestType.Noop)))
      .then(callback)
      .then(() => expect(callback).toBeCalled())
  })
})
