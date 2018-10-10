import { allStats, allVitals } from "../../attributes/constants"
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
import { MAX_TRAINABLE_STATS } from "./constants"
import { VITAL_INCREMENT } from "./train"
import PlayerBuilder from "../../test/playerBuilder"
import getActionCollection from "../actionCollection"
import { Definition } from "../definition/definition"

let testBuilder: TestBuilder
let playerBuilder: PlayerBuilder
let player: Player
let definition: Definition

beforeEach(async () => {
  testBuilder = new TestBuilder()
  testBuilder.withTrainer()
  playerBuilder = await testBuilder.withPlayer()
  player = playerBuilder.player
  definition = getActionCollection(await testBuilder.getService())
    .getMatchingHandlerDefinitionForRequestType(RequestType.Train)
})

describe("train action", () => {
  it.each(allStats)("should be able to train %s", async (stat) => {
    // given
    player.sessionMob.playerMob.trains = 1
    const initialValue = player.sessionMob.playerMob.trainedAttributes.stats[stat]

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Train, `train ${stat}`))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(player.sessionMob.playerMob.trainedAttributes.stats[stat]).toBe(initialValue + 1)
  })

  it.each(allVitals)("should be able to train %s", async (vital) => {
    // setup
    const playerMob = player.sessionMob.playerMob
    playerMob.trains = 1

    // given
    const initialVital = playerMob.trainedAttributes.vitals[vital]

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Train, `train ${vital}`))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(playerMob.trains).toBe(0)
    expect(playerMob.trainedAttributes.vitals[vital]).toBe(initialVital + VITAL_INCREMENT)
  })

  it.each(allStats)("should not exceed %s max training amount", async (stat) => {
    // setup
    testBuilder.withTrainer()
    player.sessionMob.playerMob.trains = 1

    // given
    player.sessionMob.playerMob.trainedAttributes.stats[stat] = MAX_TRAINABLE_STATS

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Train, `train ${stat}`))

    // then
    expect(response.status).toBe(ResponseStatus.ActionFailed)
    expect(response.message.toRequestCreator).toBe(Messages.Train.CannotTrainMore)
  })

  it.each(allStats)("can describe what is trainable for %s", async (stat) => {
    // setup
    testBuilder.withTrainer()

    // given
    const trainedAttributes = player.sessionMob.playerMob.trainedAttributes
    player.sessionMob.playerMob.trains = 1

    // when
    const response1 = await definition.handle(testBuilder.createRequest(RequestType.Train))

    // then
    expect(response1.status).toBe(ResponseStatus.Info)
    expect(response1.message.toRequestCreator).toContain("str int wis dex con sta hp mana mv")

    // when
    trainedAttributes.stats[stat] = MAX_TRAINABLE_STATS
    const response2 = await definition.handle(testBuilder.createRequest(RequestType.Train))

    // then
    expect(response2.message.toRequestCreator).not.toContain(stat)
  })
})
