import { CheckStatus } from "../../check/checkStatus"
import { Disposition } from "../../mob/disposition"
import { Messages as RequestMessages } from "../../request/constants"
import { RequestType } from "../../request/requestType"
import TestBuilder from "../../test/testBuilder"
import { Messages } from "./constants"
import train from "./train"

describe("train action preconditions", () => {
  it("should fail if a requested train is not understood", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withRoom()
    await testBuilder.withPlayer()

    // when
    const check = await train(
      testBuilder.createRequest(RequestType.Train, "train floodle"), await testBuilder.getService())

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(Messages.Train.CannotTrainMore)
  })

  it("should not work if a trainer is not present", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withRoom()
    await testBuilder.withPlayer()

    // when
    const check = await train(
      testBuilder.createRequest(RequestType.Train), await testBuilder.getService())

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(Messages.Train.NoTrainer)
  })

  it("should not work if the player has no available trains", async () => {
    // given
    const testBuilder = new TestBuilder()
    await testBuilder.withPlayer()
    testBuilder.withTrainer()

    // when
    const check = await train(
      testBuilder.createRequest(RequestType.Train), await testBuilder.getService())

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(Messages.Train.LackingTrains)
  })

  it("should not work if the mob is not standing", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    playerBuilder.withDisposition(Disposition.Sleeping)
    testBuilder.withTrainer()

    // when
    const check = await train(
      testBuilder.createRequest(RequestType.Train), await testBuilder.getService())

    // then
    expect(check.status).toBe(CheckStatus.Failed)
    expect(check.result).toBe(RequestMessages.NotStanding)
  })

  it("should work if all preconditions are met", async () => {
    // given
    const testBuilder = new TestBuilder()
    testBuilder.withRoom()
    await testBuilder.withPlayer()
    testBuilder.with(player => player.sessionMob.playerMob.trains = 1)
    const trainer = testBuilder.withTrainer().mob

    // when
    const check = await train(
      testBuilder.createRequest(RequestType.Train, "train con"), await testBuilder.getService())

    // then
    expect(check.status).toBe(CheckStatus.Ok)
    expect(check.result).toBe(trainer)
  })
})
