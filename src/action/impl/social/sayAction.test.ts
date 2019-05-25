import Check from "../../../check/check"
import CheckedRequest from "../../../check/checkedRequest"
import SocialService from "../../../player/service/socialService"
import InputContext from "../../../request/context/inputContext"
import {RequestType} from "../../../request/enum/requestType"
import Request from "../../../request/request"
import RequestService from "../../../request/service/requestService"
import {getTestMob} from "../../../support/test/mob"
import {getTestRoom} from "../../../support/test/room"
import SayAction from "./sayAction"

describe("say social action", () => {
  it("should publish a social event", async () => {
    // setup
    const eventService = jest.fn(() => ({
      publish: jest.fn(),
    }))()
    const action = new SayAction(new SocialService(jest.fn()(), eventService))

    // when
    await action.invoke(new RequestService(new CheckedRequest(
      new Request(
        getTestMob(),
        getTestRoom(),
        new InputContext(RequestType.Say, "say hello")),
      await Check.ok())))

    // then
    expect(eventService.publish.mock.calls.length).toBe(1)
  })
})
