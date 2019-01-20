import {CheckStatus} from "../../../check/checkStatus"
import { Disposition } from "../../../mob/enum/disposition"
import { RequestType } from "../../../request/requestType"
import { ResponseStatus } from "../../../request/responseStatus"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import { Messages } from "../../constants"
import {MESSAGE_FAIL_ALREADY_AWAKE} from "../../constants"

let testBuilder: TestBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getActionDefinition(RequestType.Wake)
})

describe("sleep action action", () => {
  it("should change the mob's disposition to standing", async () => {
    // given
    await testBuilder.withPlayer(p => p.sessionMob.disposition = Disposition.Sleeping)

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Wake))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Wake.Success)
    expect(testBuilder.player.sessionMob.disposition).toBe(Disposition.Standing)
  })

  it("should not be able to wake if already standing", async () => {
    // given
    await testBuilder.withPlayer(p => p.sessionMob.disposition = Disposition.Standing)

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Wake))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_ALREADY_AWAKE)
  })
})
