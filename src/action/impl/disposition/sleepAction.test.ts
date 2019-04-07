import {CheckStatus} from "../../../check/checkStatus"
import { Disposition } from "../../../mob/enum/disposition"
import { RequestType } from "../../../request/requestType"
import { ResponseStatus } from "../../../request/responseStatus"
import TestBuilder from "../../../support/test/testBuilder"
import Action from "../../action"
import {HelpMessages, Messages} from "../../constants"
import {ConditionMessages} from "../../constants"

let testBuilder: TestBuilder
let action: Action

beforeEach(async () => {
  testBuilder = new TestBuilder()
  action = await testBuilder.getAction(RequestType.Sleep)
})

describe("sleep action action", () => {
  it("should change the mob's disposition to sleeping", async () => {
    // given
    await testBuilder.withPlayer()

    // when
    const response = await action.handle(testBuilder.createRequest(RequestType.Sleep))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Sleep.Success)
    expect(testBuilder.player.sessionMob.disposition).toBe(Disposition.Sleeping)
  })

  it("should not be able to sleep if already sleeping", async () => {
    // given
    await testBuilder.withPlayer((player) => player.sessionMob.disposition = Disposition.Sleeping)

    // when
    const check = await action.check(testBuilder.createRequest(RequestType.Sleep))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(ConditionMessages.Sleep.AlreadySleeping)
  })

  it("provides accurate help text", () => {
    expect(action.getHelpText()).toBe(HelpMessages.ChangeDisposition)
  })
})
