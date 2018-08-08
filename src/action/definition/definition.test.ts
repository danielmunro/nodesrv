import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { getTestPlayer } from "../../test/player"
import { Definition, MESSAGE_REQUEST_TYPE_MISMATCH } from "./definition"
import TestBuilder from "../../test/testBuilder"

async function getNewHandlerDefinition(requestType = RequestType.Noop): Definition {
  const testBuilder = new TestBuilder()
  return new Definition(await testBuilder.getService(), requestType, () => new Promise((resolve) => resolve()))
}

function getNewTestRequest(requestType: RequestType): Request {
  return new Request(getTestPlayer(), requestType)
}

describe("Definition", () => {
  it("isAbleToHandleRequestType should only handle its own request type", async () => {
    const def = await getNewHandlerDefinition(RequestType.Noop)
    expect(def.isAbleToHandleRequestType(RequestType.Gossip)).toBe(false)
    expect(def.isAbleToHandleRequestType(RequestType.Noop)).toBe(true)
  })

  it("applyCallback should fail on different request types", async () => {
    await expect((await getNewHandlerDefinition(RequestType.Noop)).handle(
        getNewTestRequest(RequestType.Gossip))).rejects.toThrowError(MESSAGE_REQUEST_TYPE_MISMATCH)
  })

  it("applyCallback should succeed on matching request types", async () => {
    const callback = jest.fn()
    const definition = await getNewHandlerDefinition(RequestType.Noop)
    definition.handle(getNewTestRequest(RequestType.Noop))
      .then(callback)
      .then(() => expect(callback).toBeCalled())
  })

  it("'Any' actions can handle different types of requests", async () => {
    const handler = await getNewHandlerDefinition(RequestType.Any)
    const testCases = [RequestType.Noop, RequestType.Look, RequestType.Gossip]
    testCases.forEach((requestType) => {
      const callback = jest.fn()
      handler
        .handle(new Request(getTestPlayer(), requestType, ""))
        .then(callback)
        .then(() => expect(callback).toBeCalled())
    })
  })
})
