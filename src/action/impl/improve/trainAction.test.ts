import { allStats, allVitals } from "../../../attributes/constants"
import Attributes from "../../../attributes/model/attributes"
import { Player } from "../../../player/model/player"
import { RequestType } from "../../../request/requestType"
import { ResponseStatus } from "../../../request/responseStatus"
import PlayerBuilder from "../../../test/playerBuilder"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import { MAX_TRAINABLE_STATS } from "../../constants"
import { ConditionMessages } from "../../constants"
import {VITAL_INCREMENT} from "./trainAction"

let testBuilder: TestBuilder
let playerBuilder: PlayerBuilder
let player: Player
let definition: Action
let trainedAttributes: Attributes

beforeEach(async () => {
  testBuilder = new TestBuilder()
  testBuilder.withTrainer()
  playerBuilder = await testBuilder.withPlayer()
  player = playerBuilder.player
  trainedAttributes = player.sessionMob.playerMob.trainedAttributes
  player.sessionMob.playerMob.trains = 1
  definition = await testBuilder.getActionDefinition(RequestType.Train)
})

describe("train action", () => {
  it.each(allStats)("should be able to train %s", async (stat) => {
    // given
    const initialValue = trainedAttributes.stats[stat]

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Train, `train ${stat}`))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(trainedAttributes.stats[stat]).toBe(initialValue + 1)
  })

  it.each(allVitals)("should be able to train %s", async (vital) => {
    // setup
    const playerMob = player.sessionMob.playerMob

    // given
    const initialVital = trainedAttributes.vitals[vital]

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Train, `train ${vital}`))

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(playerMob.trains).toBe(0)
    expect(trainedAttributes.vitals[vital]).toBe(initialVital + VITAL_INCREMENT)
  })

  it.each(allStats)("should not exceed %s max training drinkAmount", async (stat) => {
    // given
    trainedAttributes.stats[stat] = MAX_TRAINABLE_STATS

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Train, `train ${stat}`))

    // then
    expect(response.status).toBe(ResponseStatus.ActionFailed)
    expect(response.message.getMessageToRequestCreator()).toBe(ConditionMessages.Train.CannotTrainMore)
  })

  it.each(allStats)("can describe what is trainable for %s", async (stat) => {
    // when
    const response1 = await definition.handle(testBuilder.createRequest(RequestType.Train))

    // then
    expect(response1.status).toBe(ResponseStatus.Info)
    expect(response1.message.getMessageToRequestCreator()).toContain("str int wis dex con sta hp mana mv")

    // when
    trainedAttributes.stats[stat] = MAX_TRAINABLE_STATS
    const response2 = await definition.handle(testBuilder.createRequest(RequestType.Train))

    // then
    expect(response2.message.getMessageToRequestCreator()).not.toContain(stat)
  })
})
