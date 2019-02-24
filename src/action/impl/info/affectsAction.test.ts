import { AffectType } from "../../../affect/affectType"
import { newAffect } from "../../../affect/factory"
import { RequestType } from "../../../request/requestType"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"

describe("affects", () => {
  it("should report when an affect is added", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const affectsAction: Action = await testBuilder.getAction(RequestType.Affects)

    // given
    const mob = testBuilder.withMob().mob
    mob.addAffect(newAffect(AffectType.Noop, 1))
    mob.addAffect(newAffect(AffectType.Stunned, 2))

    // when
    const response = await affectsAction.handle(testBuilder.createRequest(RequestType.Affects))
    const message = response.message.getMessageToRequestCreator()

    // then
    expect(message).toContain(AffectType.Noop)
    expect(message).toContain("hour\n")
    expect(message).toContain(AffectType.Stunned)
    expect(message).toContain("hours")
    expect(message).not.toContain(AffectType.Shield)
  })
})
