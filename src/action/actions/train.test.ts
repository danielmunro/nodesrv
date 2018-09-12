import { allStats } from "../../attributes/stat"
import { allVitals } from "../../attributes/vital"
import { Mob } from "../../mob/model/mob"
import { Player } from "../../player/model/player"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import Response from "../../request/response"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import Check from "../check"
import CheckedRequest from "../checkedRequest"
import train, { MAX_TRAINABLE_STATS, MESSAGE_FAIL_CANNOT_TRAIN } from "./train"

async function getResponse(player: Player, trainer: Mob, input: string): Promise<Response> {
  return await train(new CheckedRequest(
    new Request(player, RequestType.Train, input),
    await Check.ok(trainer)))
}

describe("train action", () => {
  it("should fail if a requested train is not understood", async () => {
    // given
    const testBuilder = new TestBuilder()

    // when
    const response = await getResponse(
      testBuilder.withPlayer().player,
      testBuilder.withTrainer().mob,
      "train floodle")

    // then
    expect(response.status).toBe(ResponseStatus.ActionFailed)
  })

  it ("should be able to train stats", async () => {
    await Promise.all(allStats.map(async (stat) => {
      // given
      const testBuilder = new TestBuilder()
      const player = testBuilder.withPlayer().player
      player.sessionMob.playerMob.trains = 1
      const initialValue = player.sessionMob.playerMob.trainedAttributes.stats[stat]

      // when
      const response = await getResponse(
        player,
        testBuilder.withTrainer().mob,
        `train ${stat}`)

      // then
      expect(response.status).toBe(ResponseStatus.Success)
      expect(player.sessionMob.playerMob.trains).toBe(0)
      expect(player.sessionMob.playerMob.trainedAttributes.stats[stat]).toBe(initialValue + 1)
    }))
  })

  it("should be able to train vitals", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    const playerMob = player.sessionMob.playerMob
    playerMob.trains = 3

    await Promise.all(allVitals.map(async (vital) => {
      // given
      const initialVital = playerMob.trainedAttributes.vitals[vital]

      // when
      const response = await getResponse(
        player,
        testBuilder.withTrainer().mob,
        `train ${vital}`)

      // then
      expect(response.status).toBe(ResponseStatus.Success)
      expect(playerMob.trains).toBe(0)
      expect(playerMob.trainedAttributes.vitals[vital]).toBe(initialVital + 10)
    }))
  })

  it("should not exceed stat max training amounts", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    const trainer = testBuilder.withTrainer().mob
    player.sessionMob.playerMob.trains = 10
    player.sessionMob.playerMob.trainedAttributes.stats.str = MAX_TRAINABLE_STATS
    player.sessionMob.playerMob.trainedAttributes.stats.int = MAX_TRAINABLE_STATS
    player.sessionMob.playerMob.trainedAttributes.stats.wis = MAX_TRAINABLE_STATS
    player.sessionMob.playerMob.trainedAttributes.stats.dex = MAX_TRAINABLE_STATS
    player.sessionMob.playerMob.trainedAttributes.stats.con = MAX_TRAINABLE_STATS
    player.sessionMob.playerMob.trainedAttributes.stats.sta = MAX_TRAINABLE_STATS

    // when
    const response1 = await getResponse(
      player,
      trainer,
      "train str")

    // then
    expect(response1.status).toBe(ResponseStatus.ActionFailed)
    expect(response1.message).toBe(MESSAGE_FAIL_CANNOT_TRAIN)

    // when
    const response2 = await getResponse(
      player,
      trainer,
      "train int")

    // then
    expect(response2.status).toBe(ResponseStatus.ActionFailed)
    expect(response2.message).toBe(MESSAGE_FAIL_CANNOT_TRAIN)

    // when
    const response3 = await getResponse(
      player,
      trainer,
      "train wis")

    // then
    expect(response3.status).toBe(ResponseStatus.ActionFailed)
    expect(response3.message).toBe(MESSAGE_FAIL_CANNOT_TRAIN)

    // when
    const response4 = await getResponse(
      player,
      trainer,
      "train dex")

    // then
    expect(response4.status).toBe(ResponseStatus.ActionFailed)
    expect(response4.message).toBe(MESSAGE_FAIL_CANNOT_TRAIN)

    // when
    const response5 = await getResponse(
      player,
      trainer,
      "train con")

    // then
    expect(response5.status).toBe(ResponseStatus.ActionFailed)
    expect(response5.message).toBe(MESSAGE_FAIL_CANNOT_TRAIN)

    // when
    const response6 = await getResponse(
      player,
      trainer,
      "train sta")

    // then
    expect(response6.status).toBe(ResponseStatus.ActionFailed)
    expect(response6.message).toBe(MESSAGE_FAIL_CANNOT_TRAIN)
  })

  it("can describe what is trainable", async () => {
    // given
    const testBuilder = new TestBuilder()
    const trainer = testBuilder.withTrainer().mob
    const player = testBuilder.withPlayer().player
    const trainedAttributes = player.sessionMob.playerMob.trainedAttributes

    // when
    const response1 = await getResponse(player, trainer, "")

    // then
    expect(response1.status).toBe(ResponseStatus.Info)
    expect(response1.message).toContain("str int wis dex con sta hp mana mv")

    // when
    trainedAttributes.stats.str = MAX_TRAINABLE_STATS
    const response2 = await getResponse(player, trainer, "")

    // then
    expect(response2.message).not.toContain("str")

    // when
    trainedAttributes.stats.int = MAX_TRAINABLE_STATS
    const response3 = await getResponse(player, trainer, "")

    // then
    expect(response3.message).not.toContain("int")

    // when
    trainedAttributes.stats.wis = MAX_TRAINABLE_STATS
    const response4 = await getResponse(player, trainer, "")

    // then
    expect(response4.message).not.toContain("wis")

    // when
    trainedAttributes.stats.dex = MAX_TRAINABLE_STATS
    const response5 = await getResponse(player, trainer, "")

    // then
    expect(response5.message).not.toContain("dex")

    // when
    trainedAttributes.stats.con = MAX_TRAINABLE_STATS
    const response6 = await getResponse(player, trainer, "")

    // then
    expect(response6.message).not.toContain("con")

    // when
    trainedAttributes.stats.sta = MAX_TRAINABLE_STATS
    const response7 = await getResponse(player, trainer, "")

    // then
    expect(response7.message).not.toContain("sta")
  })
})
