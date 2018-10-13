import { addFight, Fight } from "../../mob/fight/fight"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { SkillType } from "../skillType"
import { Messages } from "./constants"
import trip from "./trip"

describe("trip skill precondition", () => {
  it("should not work if the mob is out of movement", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer(p => {
      p.sessionMob.vitals.mv = 0
      p.sessionMob.level = 10
    })
    addFight(new Fight(
      playerBuilder.player.sessionMob,
      testBuilder.withMob().mob,
      testBuilder.room))

    // given
    playerBuilder.withSkill(SkillType.Trip)

    // when
    const check = await trip(testBuilder.createRequest(RequestType.Trip))

    // then
    expect(check.isOk()).toBeFalsy()
    expect(check.result).toBe(Messages.All.NotEnoughMv)
  })

  it("success sanity check", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.level = 10)
    addFight(new Fight(
      playerBuilder.player.sessionMob,
      testBuilder.withMob().mob,
      testBuilder.room))

    // given
    playerBuilder.withSkill(SkillType.Trip)

    // when
    const check = await trip(testBuilder.createRequest(RequestType.Trip))

    // then
    expect(check.isOk()).toBeTruthy()
    expect(check.result).toBeTruthy()
  })
})
