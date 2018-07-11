import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import Check from "../check"
import CheckedRequest from "../checkedRequest"
import train, { MAX_TRAINABLE_STATS, MESSAGE_FAIL_CANNOT_TRAIN } from "./train"
import Response from "../../request/response"
import { Player } from "../../player/model/player"
import { Mob } from "../../mob/model/mob"

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

  it("should be able to train str", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    player.sessionMob.trains = 1
    const initialStr = player.sessionMob.trainedAttributes.stats.str

    // when
    const response = await getResponse(
      player,
      testBuilder.withTrainer().mob,
      "train str")

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.trains).toBe(0)
    expect(player.sessionMob.trainedAttributes.stats.str).toBe(initialStr + 1)
  })

  it("should be able to train int", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    player.sessionMob.trains = 1
    const initialInt = player.sessionMob.trainedAttributes.stats.int

    // when
    const response = await getResponse(
      player,
      testBuilder.withTrainer().mob,
      "train int")

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.trains).toBe(0)
    expect(player.sessionMob.trainedAttributes.stats.int).toBe(initialInt + 1)
  })

  it("should be able to train wis", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    player.sessionMob.trains = 1
    const initialWis = player.sessionMob.trainedAttributes.stats.wis

    // when
    const response = await getResponse(
      player,
      testBuilder.withTrainer().mob,
      "train wis")

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.trains).toBe(0)
    expect(player.sessionMob.trainedAttributes.stats.wis).toBe(initialWis + 1)
  })

  it("should be able to train dex", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    player.sessionMob.trains = 1
    const initialDex = player.sessionMob.trainedAttributes.stats.dex

    // when
    const response = await getResponse(
      player,
      testBuilder.withTrainer().mob,
      "train dex")

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.trains).toBe(0)
    expect(player.sessionMob.trainedAttributes.stats.dex).toBe(initialDex + 1)
  })

  it("should be able to train con", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    player.sessionMob.trains = 1
    const initialCon = player.sessionMob.trainedAttributes.stats.con

    // when
    const response = await getResponse(
      player,
      testBuilder.withTrainer().mob,
      "train con")

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.trains).toBe(0)
    expect(player.sessionMob.trainedAttributes.stats.con).toBe(initialCon + 1)
  })

  it("should be able to train sta", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    player.sessionMob.trains = 1
    const initialSta = player.sessionMob.trainedAttributes.stats.sta

    // when
    const response = await getResponse(
      player,
      testBuilder.withTrainer().mob,
      "train sta")

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.trains).toBe(0)
    expect(player.sessionMob.trainedAttributes.stats.sta).toBe(initialSta + 1)
  })

  it("should be able to train vitals", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    player.sessionMob.trains = 3
    const initialHp = player.sessionMob.trainedAttributes.vitals.hp
    const initialMana = player.sessionMob.trainedAttributes.vitals.mana
    const initialMv = player.sessionMob.trainedAttributes.vitals.mv

    // when
    const response1 = await getResponse(
      player,
      testBuilder.withTrainer().mob,
      "train hp")

    // then
    expect(response1.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.trains).toBe(2)
    expect(player.sessionMob.trainedAttributes.vitals.hp).toBe(initialHp + 10)

    // when
    const response2 = await getResponse(
      player,
      testBuilder.withTrainer().mob,
      "train mana")

    // then
    expect(response2.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.trains).toBe(1)
    expect(player.sessionMob.trainedAttributes.vitals.mana).toBe(initialMana + 10)

    // when
    const response3 = await getResponse(
      player,
      testBuilder.withTrainer().mob,
      "train mv")

    // then
    expect(response3.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.trains).toBe(0)
    expect(player.sessionMob.trainedAttributes.vitals.mv).toBe(initialMv + 10)
  })

  it("should not exceed stat max training amounts", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    const trainer = testBuilder.withTrainer().mob
    player.sessionMob.trains = 10
    player.sessionMob.trainedAttributes.stats.str = MAX_TRAINABLE_STATS
    player.sessionMob.trainedAttributes.stats.int = MAX_TRAINABLE_STATS
    player.sessionMob.trainedAttributes.stats.wis = MAX_TRAINABLE_STATS
    player.sessionMob.trainedAttributes.stats.dex = MAX_TRAINABLE_STATS
    player.sessionMob.trainedAttributes.stats.con = MAX_TRAINABLE_STATS
    player.sessionMob.trainedAttributes.stats.sta = MAX_TRAINABLE_STATS

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
    const trainedAttributes = player.sessionMob.trainedAttributes

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
