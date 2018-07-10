import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import Check from "../check"
import CheckedRequest from "../checkedRequest"
import train from "./train"

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
})
