import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import SocialEvent from "../../client/event/socialEvent"
import InputContext from "../../request/context/inputContext"
import {Request} from "../../request/request"
import {RequestType} from "../../request/requestType"
import {getTestMob} from "../../test/mob"
import {getTestRoom} from "../../test/room"
import say from "./say"

describe("say social action", () => {
  it("should publish a social event", async () => {
    // setup
    const service = jest.fn(() => ({
      publishEvent: jest.fn(),
    }))()

    // when
    await say(new CheckedRequest(
      new Request(
        getTestMob(),
        getTestRoom(),
        new InputContext(RequestType.Say, "say hello")),
      await Check.ok()), service)

    // then
    expect(service.publishEvent.mock.calls.length).toBe(1)
    expect(service.publishEvent.mock.calls[0][0]).toBeInstanceOf(SocialEvent)
  })
})
