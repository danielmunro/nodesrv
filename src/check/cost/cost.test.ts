import {createTestAppContainer} from "../../app/factory/testFactory"
import PlayerBuilder from "../../support/test/playerBuilder"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import Cost from "./cost"
import { CostType } from "./costType"

let playerBuilder: PlayerBuilder

beforeEach(async () => {
  const testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  playerBuilder = testRunner.createPlayer()
})

describe("cost createDefaultCheckFor", () => {
  it("should be able to apply a mv cost", async () => {
    // setup
    const mob = playerBuilder.player.sessionMob
    const initialAmount = mob.vitals.mv

    // given
    const amount = 10
    const cost = new Cost(CostType.Mv, amount)

    // expect
    expect(cost.canApplyTo(mob)).toBeTruthy()

    // when
    cost.applyTo(playerBuilder.player)

    // then
    expect(mob.vitals.mv).toBe(initialAmount - amount)
  })

  it("should be able to apply a mana cost", async () => {
    // setup
    const mob = playerBuilder.player.sessionMob
    const amount = 10
    const initialAmount = mob.vitals.mana
    const cost = new Cost(CostType.Mana, amount)

    // expect
    expect(cost.canApplyTo(mob)).toBeTruthy()

    // when
    cost.applyTo(playerBuilder.player)

    // then
    expect(mob.vitals.mana).toBe(initialAmount - amount)
  })

  it("should be able to apply a delay cost", async () => {
    // setup
    const player = playerBuilder.player
    const amount = 1
    const initialAmount = player.delay
    const cost = new Cost(CostType.Delay, amount)

    // expect
    expect(cost.canApplyTo(player.sessionMob)).toBeTruthy()

    // when
    cost.applyTo(playerBuilder.player)

    // then
    expect(player.delay).toBe(initialAmount + amount)
  })

  it("should be able to apply a train cost", async () => {
    // setup
    const mob = playerBuilder.player.sessionMob
    mob.playerMob.trains = 1
    const amount = 1
    const initialAmount = mob.playerMob.trains
    const cost = new Cost(CostType.Train, amount)

    // expect
    expect(cost.canApplyTo(mob)).toBeTruthy()

    // when
    cost.applyTo(playerBuilder.player)

    // then
    expect(mob.playerMob.trains).toBe(initialAmount - amount)
  })
})
