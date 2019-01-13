import { CheckStatus } from "../../check/checkStatus"
import { Disposition } from "../../mob/enum/disposition"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { Messages } from "./constants"
import sleep from "./sleep"

describe("sleep action preconditions", () => {
  it("should not be able to sleep if already sleeping", async () => {
    // given
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer((player) => player.sessionMob.disposition = Disposition.Sleeping)

    // when
    const check = await sleep(testBuilder.createRequest(RequestType.Sleep), await testBuilder.getService())

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(Messages.Sleep.AlreadySleeping)
  })
})
