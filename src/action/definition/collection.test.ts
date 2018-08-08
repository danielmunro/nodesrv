import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"

let actions

beforeAll(async () => {
  actions = await new TestBuilder().getActionCollection()
})

describe("collection action definition", () => {
  it("should return east before equipped", async () => {
    const action = actions.getMatchingHandlerDefinitionForRequestType("e")
    expect(action.isAbleToHandleRequestType(RequestType.East)).toBeTruthy()
    expect(action.isAbleToHandleRequestType(RequestType.Equipped)).toBeFalsy()
  })

  it("should return west before wear", async () => {
    const action = actions.getMatchingHandlerDefinitionForRequestType("w")
    expect(action.isAbleToHandleRequestType(RequestType.West)).toBeTruthy()
    expect(action.isAbleToHandleRequestType(RequestType.Wear)).toBeFalsy()
  })

  it("should return get before gossip", async () => {
    const action = actions.getMatchingHandlerDefinitionForRequestType("g")
    expect(action.isAbleToHandleRequestType(RequestType.Get)).toBeTruthy()
    expect(action.isAbleToHandleRequestType(RequestType.Gossip)).toBeFalsy()
  })
})
