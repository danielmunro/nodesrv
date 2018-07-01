import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import sleep, { MESSAGE_SLEEP_SUCCESS } from "./sleep"
import { Disposition } from "../../mob/disposition"

describe("sleep action handler", () => {
  it("should change the mob's disposition to sleeping", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer()

    // when
    const response = await sleep(testBuilder.createOkCheckedRequest(RequestType.Sleep))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message).toBe(MESSAGE_SLEEP_SUCCESS)
    expect(testBuilder.player.sessionMob.disposition).toBe(Disposition.Sleeping)
  })
})
