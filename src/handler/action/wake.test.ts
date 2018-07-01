import { Disposition } from "../../mob/disposition"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import { default as wake, MESSAGE_WAKE_SUCCESS } from "./wake"

describe("sleep action handler", () => {
  it("should change the mob's disposition to standing", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer().withDisposition(Disposition.Sleeping)

    // when
    const response = await wake(testBuilder.createOkCheckedRequest(RequestType.Wake))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message).toBe(MESSAGE_WAKE_SUCCESS)
    expect(testBuilder.player.sessionMob.disposition).toBe(Disposition.Standing)
  })
})
