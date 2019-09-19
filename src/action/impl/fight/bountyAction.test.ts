import {createTestAppContainer} from "../../../app/factory/testFactory"
import {createDeathEvent} from "../../../event/factory/eventFactory"
import EventService from "../../../event/service/eventService"
import {RequestType} from "../../../messageExchange/enum/requestType"
import Death from "../../../mob/fight/death"
import {Fight} from "../../../mob/fight/fight"
import PlayerBuilder from "../../../support/test/playerBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"

let testRunner: TestRunner
let player1: PlayerBuilder
let player2: PlayerBuilder
let eventService: EventService
const goldAmount = 100

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  eventService = app.get<EventService>(Types.EventService)
  player1 = await testRunner.createPlayer()
  player2 = await testRunner.createPlayer()
})

describe("bounty action", () => {
  it("requires an argument for gold", async () => {
    // when
    const response = await testRunner.invokeAction(
      RequestType.Bounty, `bounty '${player2.getMobName()}'`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Bounty.NeedAmount)
  })

  it("requires the player to have the gold", async () => {
    // when
    const response = await testRunner.invokeAction(
      RequestType.Bounty, `bounty '${player2.getMobName()}' ${goldAmount}`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Bounty.NeedMoreGold)
  })

  it("transfers the bounty gold when a bounty is requested", async () => {
    // given
    player1.setGold(goldAmount)

    // when
    await testRunner.invokeAction(
      RequestType.Bounty, `bounty '${player2.getMobName()}' ${goldAmount}`)

    // then
    expect(player1.getMob().gold).toBe(0)
    expect(player2.getMob().getBounty()).toBe(goldAmount)
  })

  it("transfers the bounty to a killer when the target is killed", async () => {
    // given
    player2.setBounty(goldAmount)

    // when
    const fight = new Fight(eventService, player1.getMob(), player2.getMob())
    const death = new Death(player2.getMob(), player1.getMob(), goldAmount)
    await eventService.publish(createDeathEvent(death, fight))

    // then
    expect(player2.getMob().getBounty()).toBe(0)
    expect(player1.getMob().gold).toBe(goldAmount)
    expect(death.bounty).toBe(goldAmount)
  })
})
