import Spell from "../../../../action/impl/spell"
import {createTestAppContainer} from "../../../../app/factory/testFactory"
import {createCastEvent} from "../../../../event/factory/eventFactory"
import {Spell as SpellModel} from "../../../../spell/model/spell"
import {SpellType} from "../../../../spell/spellType"
import TestRunner from "../../../../support/test/testRunner"
import {Types} from "../../../../support/types"
import {MAX_PRACTICE_LEVEL} from "../../../constants"
import {MobEntity} from "../../../entity/mobEntity"
import CastEvent from "../../../event/castEvent"
import {SpecializationType} from "../../../specialization/enum/specializationType"
import {RaceType} from "../../enum/raceType"
import DrowMageBonus from "./drowMageBonus"

let testRunner: TestRunner
let eventConsumer: DrowMageBonus
let mob: MobEntity

beforeEach(async () => {
  const app = await createTestAppContainer()
  testRunner = app.get<TestRunner>(Types.TestRunner)
  eventConsumer = new DrowMageBonus(app.get<Spell[]>(Types.Spells))
  mob = testRunner.createMob()
    .setRace(RaceType.Drow)
    .setSpecialization(SpecializationType.Mage)
    .withSpell(SpellType.Heal, MAX_PRACTICE_LEVEL)
    .withSpell(SpellType.MagicMissile, MAX_PRACTICE_LEVEL)
    .get()
})

describe("drow mage bonus", () => {
  it("provides a bonus when casting mage spells", async () => {
    const eventResponse = await eventConsumer.consume(
      createCastEvent(mob, mob.getSpell(SpellType.MagicMissile) as SpellModel, testRunner.createMob().get(), 0))

    expect((eventResponse.event as CastEvent).roll).toBeGreaterThan(0)
  })

  it("does not provide a bonus when casting cleric spells", async () => {
    const eventResponse = await eventConsumer.consume(
      createCastEvent(mob, mob.getSpell(SpellType.Heal) as SpellModel, testRunner.createMob().get(), 0))

    expect((eventResponse.event as CastEvent).roll).toBe(0)
  })
})
