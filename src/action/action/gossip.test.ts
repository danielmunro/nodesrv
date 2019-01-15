import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import SocialEvent from "../../client/event/socialEvent"
import InputContext from "../../request/context/inputContext"
import {Request} from "../../request/request"
import {RequestType} from "../../request/requestType"
import {getTestMob} from "../../test/mob"
import {getTestRoom} from "../../test/room"
import TestBuilder from "../../test/testBuilder"
import gossip from "./gossip"

describe("gossip social action", () => {
  it("should be to handle gossiping", async () => {
    // setup
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    const request = testBuilder.createRequest(RequestType.Gossip, "gossip hello world")
    const handler = await testBuilder.getActionDefinition(RequestType.Gossip)

    // when
    const response = await handler.handle(request)

    // then
    expect(response.message.getMessageToRequestCreator()).toEqual("You gossip, \"hello world\"")
  })

  it("should publish a social event", async () => {
    // setup
    const service = jest.fn(() => ({
      publishEvent: jest.fn(),
    }))()

    // when
    await gossip(new CheckedRequest(
      new Request(
        getTestMob(),
        getTestRoom(),
        new InputContext(RequestType.Gossip, "gossip hello")),
      await Check.ok()), service)

    // then
    expect(service.publishEvent.mock.calls.length).toBe(1)
    expect(service.publishEvent.mock.calls[0][0]).toBeInstanceOf(SocialEvent)
  })
})
