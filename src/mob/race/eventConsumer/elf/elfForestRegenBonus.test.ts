import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {createTickEvent} from "../../../../event/factory/eventFactory"
import {Terrain} from "../../../../region/enum/terrain"
import newRegion from "../../../../region/factory/regionFactory"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import {MobEntity} from "../../../entity/mobEntity"
import TickEvent from "../../../event/tickEvent"
import {RaceType} from "../../enum/raceType"
import ElfForestRegenBonus from "./elfForestRegenBonus"

let testRunner: TestRunner
let eventConsumer: ElfForestRegenBonus
let mob: MobEntity
const regenModifier = 2

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
  mob = (await testRunner.createMob()).setRace(RaceType.Elf).get()
  eventConsumer = new ElfForestRegenBonus()
})

describe("elf forest regen bonus event consumer", () => {
  it("does not change the modifier if not in the forest", async () => {
    // when
    const eventResponse = await eventConsumer.consume(
      createTickEvent(mob, testRunner.getStartRoom().get(), regenModifier))

    // then
    expect((eventResponse.event as TickEvent).regenModifier).toBe(regenModifier)
  })

  it("does increase the modifier if in the forest", async () => {
    const room = testRunner.getStartRoom()
    room.setRegion(newRegion("test region", Terrain.Forest))

    const eventResponse = await eventConsumer.consume(
      createTickEvent(mob, room.get(), regenModifier))

    expect((eventResponse.event as TickEvent).regenModifier).toBeGreaterThan(regenModifier)
  })
})
