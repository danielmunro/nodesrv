import {createTestAppContainer} from "../../app/factory/testFactory"
import {createAttackEvent} from "../../event/factory/eventFactory"
import EventConsumer from "../../event/interface/eventConsumer"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import MobService from "../service/mobService"
import FightStarterEventConsumer from "./fightStarterEventConsumer"

let testRunner: TestRunner
let fightStarter: FightStarterEventConsumer
let mobService: MobService

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  fightStarter = app.getAll<EventConsumer>(Types.EventConsumerTable).find(eventConsumer =>
    eventConsumer instanceof FightStarterEventConsumer) as FightStarterEventConsumer
  mobService = app.get<MobService>(Types.MobService)
})

describe("fight starter", () => {
  it("starts a fight from an attack event", async () => {
    // given
    const mob1 = (await testRunner.createMob()).get()
    const mob2 = (await testRunner.createMob()).get()

    // when
    await fightStarter.consume(createAttackEvent(mob1, mob2))

    // then
    expect(mobService.findFightForMob(mob1).get()).toBeDefined()
  })

  it("won't create more than one fight between the same two mobs", async () => {
    // given
    const mob1 = (await testRunner.createMob()).get()
    const mob2 = (await testRunner.createMob()).get()

    // when
    await fightStarter.consume(createAttackEvent(mob1, mob2))
    const consumable = await fightStarter.isEventConsumable(createAttackEvent(mob1, mob2))

    // then
    expect(consumable).toBeFalsy()
  })

  it.each([
    [ true, true, 2 ],
    [ true, false, 2 ],
    [ false, true, 1 ],
    [ false, false, 1 ],
  ])(
    `testing attack rules when player 2 assist: %s, player attacks: %s, and expected number of fights: %s`,
    // @ts-ignore
    async (autoAssists: boolean, playerAttacks: boolean, expectedNumberOfFights: number) => {
    // setup
    const player1 = (await testRunner.createPlayer()).get()
    const player2 = (await testRunner.createPlayer()).get()
    player2.sessionMob.playerMob.autoAssist = autoAssists
    const mob = (await testRunner.createMob()).get()

    // given
    mobService.addGroup([player1.sessionMob, player2.sessionMob])

    // when
    if (playerAttacks) {
      await fightStarter.consume(createAttackEvent(player1.sessionMob, mob))
    } else {
      await fightStarter.consume(createAttackEvent(mob, player1.sessionMob))
    }

    // then
    expect(mobService.getFightCount()).toBe(expectedNumberOfFights)
  })
})
