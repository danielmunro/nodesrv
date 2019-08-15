import {getTestMob} from "../support/test/mob"
import ResponseMessage from "./responseMessage"

describe("response message", () => {
  it("should interpolate the message", () => {
    const responseMessage = new ResponseMessage(
      getTestMob(),
      "this has a message from {env}",
      {env: "test"})

    expect(responseMessage.getMessageToRequestCreator()).toBe("this has a message from test")
  })
})
