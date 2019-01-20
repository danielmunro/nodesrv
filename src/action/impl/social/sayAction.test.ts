import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import SocialEvent from "../../../client/event/socialEvent"
import InputContext from "../../../request/context/inputContext"
import {Request} from "../../../request/request"
import {RequestType} from "../../../request/requestType"
import SocialService from "../../../social/socialService"
import {getTestMob} from "../../../test/mob"
import {getTestRoom} from "../../../test/room"
import SayAction from "./sayAction"

describe("say social action", () => {
  it("should publish a social event", async () => {
    // setup
    const eventService = jest.fn(() => ({
      publish: jest.fn(),
    }))()
    const action = new SayAction(new SocialService(jest.fn()(), eventService))

    // when
    await action.invoke(new CheckedRequest(
      new Request(
        getTestMob(),
        getTestRoom(),
        new InputContext(RequestType.Say, "say hello")),
      await Check.ok()))

    // then
    expect(eventService.publish.mock.calls.length).toBe(1)
    expect(eventService.publish.mock.calls[0][0]).toBeInstanceOf(SocialEvent)
  })
})
