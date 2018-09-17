import { Disposition } from "../../mob/disposition"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { CheckStatus } from "../check"
import { default as wake, MESSAGE_FAIL_DEAD } from "./wake"
import { MESSAGE_FAIL_ALREADY_AWAKE } from "./constants"

describe("wake actions precondition", () => {
  it("should not be able to wake if already standing", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer().withDisposition(Disposition.Standing)

    // when
    const check = await wake(testBuilder.createRequest(RequestType.Wake))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_ALREADY_AWAKE)
  })

  it("should not be able to wake if dead", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withPlayer().withDisposition(Disposition.Dead)

    // when
    const check = await wake(testBuilder.createRequest(RequestType.Wake))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_DEAD)
  })
})
