import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import CheckResult from "../../check/checkResult"
import {CheckType} from "../../check/checkType"
import SocialEvent from "../../client/event/socialEvent"
import InputContext from "../../request/context/inputContext"
import {Request} from "../../request/request"
import {RequestType} from "../../request/requestType"
import {getTestMob} from "../../test/mob"
import {getTestRoom} from "../../test/room"
import TestBuilder from "../../test/testBuilder"
import tell from "./tell"

describe("tell social action", () => {
  it("should be to handle gossiping", async () => {
    // setup
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    const mob = testBuilder.withMob("foo").mob
    const actions = await testBuilder.getActionCollection()
    const request = testBuilder.createRequest(RequestType.Tell, "tell foo hello world")
    const handler = actions.getMatchingHandlerDefinitionForRequestType(request.getType())

    // when
    const response = await handler.handle(request)

    // then
    expect(response.message.getMessageToRequestCreator()).toEqual(`You tell ${mob.name}, \"hello world\"`)
  })

  it("should publish a social event", async () => {
    // setup
    const service = jest.fn(() => ({
      publishEvent: jest.fn(),
    }))()

    // when
    await tell(new CheckedRequest(
      new Request(
        getTestMob(),
        getTestRoom(),
        new InputContext(RequestType.Tell, "tell foo hello")),
      await Check.ok(null, [new CheckResult(CheckType.HasTarget, getTestMob())])), service)

    // then
    expect(service.publishEvent.mock.calls.length).toBe(1)
    expect(service.publishEvent.mock.calls[0][0]).toBeInstanceOf(SocialEvent)
  })
})
