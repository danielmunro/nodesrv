import {getTestMob} from "../test/mob"
import ResponseMessage from "./responseMessage"

describe("response message", () => {
  it("should interpolate the message", () => {
    const responseMessage = new ResponseMessage(
      getTestMob(),
      "this is a message from {env}",
      {env: "test"})

    expect(responseMessage.getMessageToRequestCreator()).toBe("this is a message from test")
  })
})
