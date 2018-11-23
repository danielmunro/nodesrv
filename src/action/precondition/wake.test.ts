import { CheckStatus } from "../../check/checkStatus"
import { Disposition } from "../../mob/enum/disposition"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { MESSAGE_FAIL_ALREADY_AWAKE, MESSAGE_FAIL_DEAD } from "./constants"
import { default as wake } from "./wake"

describe("wake action preconditions", () => {
  it("should not be able to wake if already standing", async () => {
    // given
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer(p => p.sessionMob.disposition = Disposition.Standing)

    // when
    const check = await wake(testBuilder.createRequest(RequestType.Wake))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_ALREADY_AWAKE)
  })

  it("should not be able to wake if dead", async () => {
    // given
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer(p => p.sessionMob.disposition = Disposition.Dead)

    // when
    const check = await wake(testBuilder.createRequest(RequestType.Wake))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_DEAD)
  })
})
