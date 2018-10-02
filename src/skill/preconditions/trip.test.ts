import { addFight, Fight, reset } from "../../mob/fight/fight"
import { Trigger } from "../../mob/trigger"
import { RequestType } from "../../request/requestType"
import { getTestMob } from "../../test/mob"
import { getTestPlayer } from "../../test/player"
import TestBuilder from "../../test/testBuilder"
import Attempt from "../attempt"
import AttemptContext from "../attemptContext"
import { CheckResult } from "../checkResult"
import { Costs } from "../constants"
import { newSkill } from "../factory"
import { SkillType } from "../skillType"
import { Messages } from "./constants"
import trip from "./trip"

describe("trip skill precondition", () => {
  it("should not work if the mob is out of movement", async () => {
    // setup
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer(p => p.sessionMob.vitals.mv = 0)
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
    const playerBuilder = await testBuilder.withPlayer()
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
