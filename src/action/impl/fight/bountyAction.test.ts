import {Round} from "../../../mob/fight/round"
import {RequestType} from "../../../request/requestType"
import PlayerBuilder from "../../../test/playerBuilder"
import TestBuilder from "../../../test/testBuilder"
import {Messages} from "../../constants"

let testBuilder: TestBuilder
let player1: PlayerBuilder
let player2: PlayerBuilder
const goldAmount = 100

beforeEach(async () => {
  testBuilder = new TestBuilder()
  testBuilder.withRoom()
  player1 = await testBuilder.withPlayer()
  player2 = await testBuilder.withPlayer()
})

describe("bounty action", () => {
  it("requires an argument for gold", async () => {
    // when
    const response = await testBuilder.handleAction(
      RequestType.Bounty, `bounty '${player2.getMob().name}'`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Bounty.NeedAmount)
  })

  it("requires the player to have the gold", async () => {
    // when
    const response = await testBuilder.handleAction(
      RequestType.Bounty, `bounty '${player2.getMob().name}' ${goldAmount}`)

    // then
    expect(response.getMessageToRequestCreator()).toBe(Messages.Bounty.NeedMoreGold)
  })

  it("transfers the bounty gold when a bounty is requested", async () => {
    // given
    player1.setGold(goldAmount)

    // when
    await testBuilder.handleAction(
      RequestType.Bounty, `bounty '${player2.getMob().name}' ${goldAmount}`)

    // then
    expect(player1.getMob().gold).toBe(0)
    expect(player2.getMob().playerMob.bounty).toBe(goldAmount)
  })

  it("transfers the bounty to a killer when the target is killed", async () => {
    // setup
    player2.setBounty(goldAmount).setHp(1)

    // given
    const fight = await testBuilder.fight(player2.getMob())
    let lastRound: Round

    // when
    while (fight.isInProgress()) {
      player1.setHp(20)
      lastRound = await fight.round()
    }

    // then
    expect(player2.getMob().playerMob.bounty).toBe(0)
    expect(player1.getMob().gold).toBe(goldAmount)
    expect(lastRound.death.bounty).toBe(goldAmount)
  })
})
