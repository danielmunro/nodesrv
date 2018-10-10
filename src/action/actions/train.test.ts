import { allStats } from "../../attributes/constants"
import { allVitals } from "../../attributes/constants"
import Check from "../../check/check"
import CheckedRequest from "../../check/checkedRequest"
import { Mob } from "../../mob/model/mob"
import { Player } from "../../player/model/player"
import InputContext from "../../request/context/inputContext"
import { Request } from "../../request/request"
import { RequestType } from "../../request/requestType"
import Response from "../../request/response"
import { ResponseStatus } from "../../request/responseStatus"
import TestBuilder from "../../test/testBuilder"
import { Messages } from "../precondition/constants"
import trainPrecondition from "../precondition/train"
import { MAX_TRAINABLE_STATS } from "./constants"
import train, { VITAL_INCREMENT } from "./train"

async function getResponse(player: Player, trainer: Mob, input: string): Promise<Response> {
  return await train(new CheckedRequest(
    new Request(player.sessionMob, new InputContext(RequestType.Train, input)),
    await Check.ok(trainer)))
}

describe("train action", () => {
  it ("should be able to train stats", async () => {
    await Promise.all(allStats.map(async (stat) => {
      // given
      const testBuilder = new TestBuilder()
      const playerBuilder = await testBuilder.withPlayer()
      const player = playerBuilder.player
      player.sessionMob.playerMob.trains = 1
      const initialValue = player.sessionMob.playerMob.trainedAttributes.stats[stat]
      const request = testBuilder.createRequest(RequestType.Train, `train ${stat}`)

      // when
      const response = await train(
        new CheckedRequest(
          request,
          await trainPrecondition(request)))

      // then
      expect(response.status).toBe(ResponseStatus.Success)
      expect(player.sessionMob.playerMob.trainedAttributes.stats[stat]).toBe(initialValue + 1)
    }))
  })

  it("should be able to train vitals", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const player = playerBuilder.player
    const playerMob = player.sessionMob.playerMob
    playerMob.trains = 3

    await Promise.all(allVitals.map(async (vital) => {
      // given
      const initialVital = playerMob.trainedAttributes.vitals[vital]
      const request = testBuilder.createRequest(RequestType.Train, `train ${vital}`)

      // when
      const response = await train(
        new CheckedRequest(
          request,
          await trainPrecondition(request)))

      // then
      expect(response.status).toBe(ResponseStatus.Success)
      expect(playerMob.trains).toBe(0)
      expect(playerMob.trainedAttributes.vitals[vital]).toBe(initialVital + VITAL_INCREMENT)
    }))
  })

  it("should not exceed stat max training amounts", async () => {
    // given
    const testBuilder = new TestBuilder()
    const playerBuilder = await testBuilder.withPlayer()
    const player = playerBuilder.player
    testBuilder.withTrainer()
    player.sessionMob.playerMob.trains = 10
    player.sessionMob.playerMob.trainedAttributes.stats.str = MAX_TRAINABLE_STATS
    player.sessionMob.playerMob.trainedAttributes.stats.int = MAX_TRAINABLE_STATS
    player.sessionMob.playerMob.trainedAttributes.stats.wis = MAX_TRAINABLE_STATS
    player.sessionMob.playerMob.trainedAttributes.stats.dex = MAX_TRAINABLE_STATS
    player.sessionMob.playerMob.trainedAttributes.stats.con = MAX_TRAINABLE_STATS
    player.sessionMob.playerMob.trainedAttributes.stats.sta = MAX_TRAINABLE_STATS

    // when
    await allStats.forEach(async stat => {
      const request = testBuilder.createRequest(RequestType.Train, `train ${stat}`)
      const response = await train(
        new CheckedRequest(
          request,
          await trainPrecondition(request)))

      // then
      expect(response.status).toBe(ResponseStatus.ActionFailed)
      expect(response.message.toRequestCreator).toBe(Messages.Train.CannotTrainMore)
    })
  })

  it("can describe what is trainable", async () => {
    // given
    const testBuilder = new TestBuilder()
    const trainer = testBuilder.withTrainer().mob
    const playerBuilder = await testBuilder.withPlayer()
    const player = playerBuilder.player
    const trainedAttributes = player.sessionMob.playerMob.trainedAttributes

    // when
    const response1 = await getResponse(player, trainer, "")

    // then
    expect(response1.status).toBe(ResponseStatus.Info)
    expect(response1.message.toRequestCreator).toContain("str int wis dex con sta hp mana mv")

    // when
    trainedAttributes.stats.str = MAX_TRAINABLE_STATS
    const response2 = await getResponse(player, trainer, "")

    // then
    expect(response2.message.toRequestCreator).not.toContain("str")

    // when
    trainedAttributes.stats.int = MAX_TRAINABLE_STATS
    const response3 = await getResponse(player, trainer, "")

    // then
    expect(response3.message.toRequestCreator).not.toContain("int")

    // when
    trainedAttributes.stats.wis = MAX_TRAINABLE_STATS
    const response4 = await getResponse(player, trainer, "")

    // then
    expect(response4.message.toRequestCreator).not.toContain("wis")

    // when
    trainedAttributes.stats.dex = MAX_TRAINABLE_STATS
    const response5 = await getResponse(player, trainer, "")

    // then
    expect(response5.message.toRequestCreator).not.toContain("dex")

    // when
    trainedAttributes.stats.con = MAX_TRAINABLE_STATS
    const response6 = await getResponse(player, trainer, "")

    // then
    expect(response6.message.toRequestCreator).not.toContain("con")

    // when
    trainedAttributes.stats.sta = MAX_TRAINABLE_STATS
    const response7 = await getResponse(player, trainer, "")

    // then
    expect(response7.message.toRequestCreator).not.toContain("sta")
  })
})
