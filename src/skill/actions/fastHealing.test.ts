import CheckedRequest from "../../check/checkedRequest"
import doNTimes from "../../functional/times"
import { MAX_PRACTICE_LEVEL } from "../../mob/constants"
import { Trigger } from "../../mob/trigger"
import EventContext from "../../request/context/eventContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import fastHealingPrecondition from "../preconditions/fastHealing"
import { SkillType } from "../skillType"
import fastHealing from "./fastHealing"

describe("fast healing skill action", () => {
  it("should succeed and fail periodically", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const mobBuilder = testBuilder.withMob()
    mobBuilder.mob.level = 30
    mobBuilder.withSkill(SkillType.FastHealing, MAX_PRACTICE_LEVEL)
    const request = new Request(mobBuilder.mob, new EventContext(RequestType.Event, Trigger.Tick))
    const check = await fastHealingPrecondition(request)

    const responses = await doNTimes(100, () => fastHealing(new CheckedRequest(request, check)))

    expect(responses.some(response => response.isSuccessful())).toBeTruthy()
    expect(responses.some(response => response.isFailure())).toBeTruthy()
  })
})
