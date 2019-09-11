import {createTestAppContainer} from "../../../app/factory/testFactory"
import {RequestType} from "../../../messageExchange/enum/requestType"
import {Round} from "../../../mob/fight/round"
import PlayerBuilder from "../../../support/test/playerBuilder"
import TestRunner from "../../../support/test/testRunner"
import {Types} from "../../../support/types"
import {Messages} from "../../constants"

let testRunner: TestRunner
let player1: PlayerBuilder
let player2: PlayerBuilder
const goldAmount = 100

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
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
    // setup
    player2.setBounty(goldAmount).setHp(1)

    // given
    const fight = await testRunner.fight(player2.getMob())
    let lastRound: Round

    // when
    while (fight.isInProgress()) {
      player1.setHp(20)
      lastRound = await fight.createFightRound()
    }

    // then
    expect(player2.getMob().getBounty()).toBe(0)
    expect(player1.getMob().gold).toBe(goldAmount)
    // @ts-ignore
    expect(lastRound.death.bounty).toBe(goldAmount)
  })
})
