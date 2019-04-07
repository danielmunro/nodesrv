import {RequestType} from "../../../request/requestType"
import TestBuilder from "../../../support/test/testBuilder"
import Action from "../../action"

let testBuilder: TestBuilder
let gossipAction: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  gossipAction = await testBuilder.getAction(RequestType.Gossip)
})

describe("gossip social action", () => {
  it("should be to handle gossiping", async () => {
    // setup
    await testBuilder.withPlayer()
    const request = testBuilder.createRequest(RequestType.Gossip, "gossip hello world")

    // when
    const response = await gossipAction.handle(request)

    // then
    expect(response.message.getMessageToRequestCreator()).toEqual("You gossip, \"hello world\"")
  })
})
