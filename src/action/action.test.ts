import InputContext from "../request/context/inputContext"
import { Request } from "../request/request"
import { RequestType } from "../request/requestType"
import { getTestMob } from "../test/mob"
import { getTestRoom } from "../test/room"
import TestBuilder from "../test/testBuilder"
import Action from "./action"
import { MESSAGE_REQUEST_TYPE_MISMATCH } from "./constants"

let testBuilder: TestBuilder
let noopDefinition: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  noopDefinition = await testBuilder.getActionDefinition(RequestType.Noop)
})

describe("Action", () => {
  it("isAbleToHandleRequestType should only handle its own request type", async () => {
    expect(noopDefinition.isAbleToHandleRequestType(RequestType.Gossip)).toBe(false)
    expect(noopDefinition.isAbleToHandleRequestType(RequestType.Noop)).toBe(true)
  })

  it("applyCallback should fail on different request types", async () => {
    const def = await testBuilder.getActionDefinition(RequestType.Noop)
    await expect(def.handle(testBuilder.createRequest(RequestType.Gossip)))
      .rejects.toThrowError(MESSAGE_REQUEST_TYPE_MISMATCH)
  })

  it("applyCallback should succeed on matching request types", async () => {
    const callback = jest.fn()
    noopDefinition.handle(testBuilder.createRequest(RequestType.Noop))
      .then(callback)
      .then(() => expect(callback).toBeCalled())
  })

  it("'AnyAction' action can handle different types of requests", async () => {
    const testCases = [RequestType.Noop, RequestType.Look, RequestType.Gossip]
    testCases.forEach((requestType) => {
      const callback = jest.fn()
      noopDefinition
        .handle(new Request(getTestMob(), getTestRoom(), new InputContext(requestType)))
        .then(callback)
        .then(() => expect(callback).toBeCalled())
    })
  })
})
