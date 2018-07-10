import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import Check from "../check"
import CheckedRequest from "../checkedRequest"
import train, { MAX_TRAINABLE_STATS, MESSAGE_FAIL_CANNOT_TRAIN } from "./train"

describe("train action", () => {
  it("should fail if a requested train is not understood", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    const trainer = testBuilder.withTrainer().mob

    // when
    const response = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train floodle"),
      await Check.ok(trainer)))

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
    const response = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train str"),
      await Check.ok(testBuilder.withTrainer().mob)))

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
    const response = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train int"),
      await Check.ok(testBuilder.withTrainer().mob)))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.trains).toBe(0)
    expect(player.sessionMob.trainedAttributes.stats.int).toBe(initialInt + 1)
  })

  it("should be able to train dex", async () => {
    // given
    const testBuilder = new TestBuilder()
    const player = testBuilder.withPlayer().player
    player.sessionMob.trains = 1
    const initialDex = player.sessionMob.trainedAttributes.stats.dex

    // when
    const response = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train dex"),
      await Check.ok(testBuilder.withTrainer().mob)))

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
    const response = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train con"),
      await Check.ok(testBuilder.withTrainer().mob)))

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
    const response = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train sta"),
      await Check.ok(testBuilder.withTrainer().mob)))

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
    const response1 = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train hp"),
      await Check.ok(testBuilder.withTrainer().mob)))

    // then
    expect(response1.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.trains).toBe(2)
    expect(player.sessionMob.trainedAttributes.vitals.hp).toBe(initialHp + 10)

    // when
    const response2 = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train mana"),
      await Check.ok(testBuilder.withTrainer().mob)))

    // then
    expect(response2.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.trains).toBe(1)
    expect(player.sessionMob.trainedAttributes.vitals.mana).toBe(initialMana + 10)

    // when
    const response3 = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train mv"),
      await Check.ok(testBuilder.withTrainer().mob)))

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
    const response1 = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train str"),
      await Check.ok(trainer)))
    expect(response1.status).toBe(ResponseStatus.ActionFailed)
    expect(response1.message).toBe(MESSAGE_FAIL_CANNOT_TRAIN)

    const response2 = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train int"),
      await Check.ok(trainer)))
    expect(response2.status).toBe(ResponseStatus.ActionFailed)
    expect(response2.message).toBe(MESSAGE_FAIL_CANNOT_TRAIN)

    const response3 = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train wis"),
      await Check.ok(trainer)))
    expect(response3.status).toBe(ResponseStatus.ActionFailed)
    expect(response3.message).toBe(MESSAGE_FAIL_CANNOT_TRAIN)

    const response4 = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train dex"),
      await Check.ok(trainer)))
    expect(response4.status).toBe(ResponseStatus.ActionFailed)
    expect(response4.message).toBe(MESSAGE_FAIL_CANNOT_TRAIN)

    const response5 = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train con"),
      await Check.ok(trainer)))
    expect(response5.status).toBe(ResponseStatus.ActionFailed)
    expect(response5.message).toBe(MESSAGE_FAIL_CANNOT_TRAIN)

    const response6 = await train(new CheckedRequest(
      new Request(player, RequestType.Train, "train sta"),
      await Check.ok(trainer)))
    expect(response6.status).toBe(ResponseStatus.ActionFailed)
    expect(response6.message).toBe(MESSAGE_FAIL_CANNOT_TRAIN)
  })
})
