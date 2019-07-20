import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {createMobMoveEvent} from "../../../../event/factory/eventFactory"
import {Terrain} from "../../../../region/enum/terrain"
import newRegion from "../../../../region/factory/regionFactory"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import {MobEntity} from "../../../entity/mobEntity"
import MobMoveEvent from "../../../event/mobMoveEvent"
import {RaceType} from "../../enum/raceType"
import HalflingMvBonus from "./halflingMvBonus"

let testRunner: TestRunner
let consumer: HalflingMvBonus
let mob: MobEntity

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mob = (await testRunner.createMob()).setRace(RaceType.Halfling).get()
  consumer = new HalflingMvBonus()
})

describe("halfling mv bonus event consumer", () => {
  it.each([
    [ Terrain.Settlement ],
    [ Terrain.Mountains ],
    [ Terrain.Water ],
    [ Terrain.Other ],
  ])("does not reduce mv cost in settlements, mountains, and water", async () => {
    const eventResponse = await consumer.consume(createMobMoveEvent(
      mob,
      testRunner.getStartRoom().get(),
      testRunner.createRoom().get(),
      1))

    expect((eventResponse.event as MobMoveEvent).mvCost).toBe(1)
  })

  it.each([
    [ Terrain.Forest ],
    [ Terrain.Plains ],
  ])("reduces mv cost in forest and plains", async (terrain: Terrain) => {
    const eventResponse = await consumer.consume(createMobMoveEvent(
      mob,
      testRunner.getStartRoom().setRegion(newRegion("test", terrain)).get(),
      testRunner.createRoom().get(),
      1))

    expect((eventResponse.event as MobMoveEvent).mvCost).toBeLessThan(1)
  })
})
