import { AffectType } from "../../../affect/affectType"
import { RequestType } from "../../../request/requestType"
import TestBuilder from "../../../test/testBuilder"

describe("affects", () => {
  it("should report when an affect has added", async () => {
    // setup
    const testBuilder = new TestBuilder()

    // given
    testBuilder.withMob()
      .addAffectType(AffectType.Noop, 1)
      .addAffectType(AffectType.Stunned, 2)

    // when
    const response = await testBuilder.handleAction(RequestType.Affects)
    const message = response.message.getMessageToRequestCreator()

    // then
    expect(message).toContain(AffectType.Noop)
    expect(message).toContain("hour\n")
    expect(message).toContain(AffectType.Stunned)
    expect(message).toContain("hours")
    expect(message).not.toContain(AffectType.Shield)
  })
})
