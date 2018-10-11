import { allStats, allVitals } from "../../attributes/constants"
import Attributes from "../../attributes/model/attributes"
import { Player } from "../../player/model/player"
import { RequestType } from "../../request/requestType"
import { ResponseStatus } from "../../request/responseStatus"
import PlayerBuilder from "../../test/playerBuilder"
import TestBuilder from "../../test/testBuilder"
import getActionCollection from "../actionCollection"
import { Definition } from "../definition/definition"
import { Messages } from "../precondition/constants"
import { MAX_TRAINABLE_STATS } from "./constants"
import { VITAL_INCREMENT } from "./train"

let testBuilder: TestBuilder
let playerBuilder: PlayerBuilder
let player: Player
let definition: Definition
let trainedAttributes: Attributes

beforeEach(async () => {
  testBuilder = new TestBuilder()
  testBuilder.withTrainer()
  playerBuilder = await testBuilder.withPlayer()
  player = playerBuilder.player
  trainedAttributes = player.sessionMob.playerMob.trainedAttributes
  player.sessionMob.playerMob.trains = 1
  definition = getActionCollection(await testBuilder.getService())
    .getMatchingHandlerDefinitionForRequestType(RequestType.Train)
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

  it.each(allStats)("should not exceed %s max training amount", async (stat) => {
    // given
    trainedAttributes.stats[stat] = MAX_TRAINABLE_STATS

    // when
    const response = await definition.handle(testBuilder.createRequest(RequestType.Train, `train ${stat}`))

    // then
    expect(response.status).toBe(ResponseStatus.ActionFailed)
    expect(response.message.toRequestCreator).toBe(Messages.Train.CannotTrainMore)
  })

  it.each(allStats)("can describe what is trainable for %s", async (stat) => {
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
