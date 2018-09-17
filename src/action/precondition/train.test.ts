import { Disposition } from "../../mob/disposition"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { CheckStatus } from "../check"
import { MESSAGE_FAIL_NEED_TRAINS, MESSAGE_FAIL_NO_TRAINER, MESSAGE_FAIL_NOT_STANDING } from "./constants"
import train from "./train"

describe("train action precondition", () => {
  it("should not work if a trainer is not present", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player

    // when
    const check = await train(new Request(player, RequestType.Train))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NO_TRAINER)
  })

  it("should not work if the player has no available trains", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    testBuilder.withTrainer()

    // when
    const check = await train(new Request(player, RequestType.Train))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NEED_TRAINS)
  })

  it("should not work if the mob is not standing", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    player.sessionMob.disposition = Disposition.Sleeping
    testBuilder.withTrainer()

    // when
    const check = await train(new Request(player, RequestType.Train))

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(MESSAGE_FAIL_NOT_STANDING)
  })

  it("should work if all preconditions are met", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    player.sessionMob.playerMob.trains = 1
    const trainer = testBuilder.withTrainer().mob

    // when
    const check = await train(new Request(player, RequestType.Train, "train con"))

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(trainer)
  })
})
