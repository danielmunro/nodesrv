import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import Check from "../check"
import CheckedRequest from "../checkedRequest"
import train from "./train"

describe("train action", () => {
  it("should fail if a requested train is not understood", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    const trainer = testBuilder.withTrainer().mob

    // when
    const response = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train floodle"),
      await Check.ok(trainer)))

    // then
    expect(response.status).toBe(ResponseStatus.ActionFailed)
  })
})
