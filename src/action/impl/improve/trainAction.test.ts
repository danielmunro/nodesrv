import {createTestAppContainer} from "../../../app/factory/testFactory"
import { allStats, allVitals } from "../../../attributes/constants"
import AttributesEntity from "../../../attributes/entity/attributesEntity"
import { RequestType } from "../../../messageExchange/enum/requestType"
import { ResponseStatus } from "../../../messageExchange/enum/responseStatus"
import PlayerBuilder from "../../../support/test/playerBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import { ConditionMessages } from "../../constants"
import { MAX_TRAINABLE_STATS } from "../../constants"
import {VITAL_INCREMENT} from "./trainAction"

let testRunner: TestRunner
let playerBuilder: PlayerBuilder
let trainedAttributes: AttributesEntity

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  playerBuilder = (await testRunner.createPlayer()).setTrains(1)
  trainedAttributes = playerBuilder.getMob().playerMob.trainedAttributes
  const trainer = await testRunner.createMob()
  trainer.asTrainer()
})

describe("train action", () => {
  it.each(allStats)("should be able to train %s", async (stat) => {
    // given
    const initialValue = trainedAttributes[stat]

    // when
    const response = await testRunner.invokeAction(RequestType.Train, `train ${stat}`)

    // then
    expect(response.isSuccessful()).toBeTruthy()
    expect(trainedAttributes[stat]).toBe(initialValue + 1)
  })

  it.each(allVitals)("should be able to train %s", async (vital) => {
    // setup
    const playerMob = playerBuilder.getMob().playerMob

    // given
    const initialVital = trainedAttributes[vital]

    // when
    const response = await testRunner.invokeAction(RequestType.Train, `train ${vital}`)

    // then
    expect(response.status).toBe(ResponseStatus.Success)
    expect(playerMob.trains).toBe(0)
    expect(trainedAttributes[vital]).toBe(initialVital + VITAL_INCREMENT)
  })

  it.each(allStats)("should not exceed %s max training drinkAmount", async (stat) => {
    // given
    trainedAttributes[stat] = MAX_TRAINABLE_STATS

    // when
    const response = await testRunner.invokeAction(RequestType.Train, `train ${stat}`)

    // then
    expect(response.status).toBe(ResponseStatus.ActionFailed)
    expect(response.getMessageToRequestCreator()).toBe(ConditionMessages.Train.CannotTrainMore)
  })

  it.each(allStats)("can describe what has trainable for %s", async (stat) => {
    // when
    const response1 = await testRunner.invokeAction(RequestType.Train)

    // then
    expect(response1.status).toBe(ResponseStatus.Info)
    expect(response1.message.getMessageToRequestCreator()).toContain("str int wis dex con sta hp mana mv")

    // when
    trainedAttributes[stat] = MAX_TRAINABLE_STATS
    const response2 = await testRunner.invokeAction(RequestType.Train)

    // then
    expect(response2.message.getMessageToRequestCreator()).not.toContain(stat)
  })
})
