import { RequestType } from "../request/requestType"
import TestBuilder from "../support/test/testBuilder"
import Action from "./action"

let testBuilder: TestBuilder
let noopDefinition: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  noopDefinition = await testBuilder.getAction(RequestType.Noop)
})

describe("Action", () => {
  it("isAbleToHandleRequestType should only handle its own request type", async () => {
    expect(noopDefinition.isAbleToHandleRequestType(RequestType.Gossip)).toBe(false)
    expect(noopDefinition.isAbleToHandleRequestType(RequestType.Noop)).toBe(true)
  })

  it("applyCallback should fail on different request types", async () => {
    const def = await testBuilder.getAction(RequestType.Noop)
    await expect(def.handle(testBuilder.createRequest(RequestType.Gossip)))
      .rejects.toThrowError()
  })

  it("applyCallback should succeed on matching request types", async () => {
    const callback = jest.fn()
    noopDefinition.handle(testBuilder.createRequest(RequestType.Noop))
      .then(callback)
      .then(() => expect(callback).toBeCalled())
  })
})
