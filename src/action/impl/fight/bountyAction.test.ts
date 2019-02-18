import {Round} from "../../../mob/fight/round"
import {Player} from "../../../player/model/player"
import {RequestType} from "../../../request/requestType"
import TestBuilder from "../../../test/testBuilder"
import Action from "../../action"
import {Messages} from "../../constants"

let testBuilder: TestBuilder
let action: Action
let player1: Player
let player2: Player

beforeEach(async () => {
  testBuilder = new TestBuilder()
  testBuilder.withRoom()
  action = await testBuilder.getActionDefinition(RequestType.Bounty)
  player1 = (await testBuilder.withPlayer()).player
  player2 = (await testBuilder.withPlayer()).player
})

describe("bounty action", () => {
  it("requires an argument for gold", async () => {
    // when
    const response = await action.handle(
      testBuilder.createRequest(RequestType.Bounty, `bounty '${player2.sessionMob.name}'`))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Bounty.NeedAmount)
  })

  it("requires the player to have the gold", async () => {
    // when
    const response = await action.handle(
      testBuilder.createRequest(RequestType.Bounty, `bounty '${player2.sessionMob.name}' 100`))

    // then
    expect(response.message.getMessageToRequestCreator()).toBe(Messages.Bounty.NeedMoreGold)
  })

  it("transfers the bounty gold when a bounty is requested", async () => {
    // given
    player1.sessionMob.gold = 100

    // when
    await action.handle(
      testBuilder.createRequest(RequestType.Bounty, `bounty '${player2.sessionMob.name}' 100`))

    // then
    expect(player1.sessionMob.gold).toBe(0)
    expect(player2.sessionMob.playerMob.bounty).toBe(100)
  })

  it("transfers the bounty to a killer when the target is killed", async () => {
    // setup
    player2.sessionMob.playerMob.bounty = 100
    player2.sessionMob.vitals.hp = 1

    // given
    const fight = await testBuilder.fight(player2.sessionMob)
    let lastRound: Round

    // when
    while (fight.isInProgress()) {
      lastRound = await fight.round()
    }

    // then
    expect(player2.sessionMob.playerMob.bounty).toBe(0)
    expect(player1.sessionMob.gold).toBe(100)
    expect(lastRound.death.bounty).toBe(100)
  })
})