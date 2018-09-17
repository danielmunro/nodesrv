import { Disposition } from "../../mob/disposition"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import { MESSAGE_SLEEP_SUCCESS } from "./constants"
import sleep from "./sleep"

describe("sleep actions actions", () => {
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
