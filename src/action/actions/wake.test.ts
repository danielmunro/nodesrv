import { Disposition } from "../../mob/disposition"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import { Messages } from "./constants"
import { default as wake } from "./wake"

describe("sleep actions actions", () => {
  it("should change the mob's disposition to standing", async () => {
    // given
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer(p => p.sessionMob.disposition = Disposition.Sleeping)

    // when
    const response = await wake(testBuilder.createOkCheckedRequest(RequestType.Wake))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Wake.Success)
    expect(testBuilder.player.sessionMob.disposition).toBe(Disposition.Standing)
  })
})
