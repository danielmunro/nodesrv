import {AffectEntity} from "../../affect/entity/affectEntity"
import { AffectType } from "../../affect/enum/affectType"
import { newAffect } from "../../affect/factory/affectFactory"
import {createTestAppContainer} from "../../app/factory/testFactory"
import MobTable from "../../mob/table/mobTable"
import TestRunner from "../../support/test/testRunner"
import {Types} from "../../support/types"
import {DecrementAffects} from "./decrementAffects"

const TEST_TIMEOUT_1 = 50
const TEST_TIMEOUT_2 = 122
let testRunner: TestRunner

beforeEach(async () => {
  testRunner = (await createTestAppContainer()).get<TestRunner>(Types.TestRunner)
})

describe("decrementAffects", () => {
  it("should decrement all affects for a mob", async () => {
    // setup
    const mob = testRunner.createMob().get()
    const affect = mob.affect()
    affect.add(newAffect(AffectType.Stunned, TEST_TIMEOUT_1))
    affect.add(newAffect(AffectType.Shield, TEST_TIMEOUT_2))
    const table = new MobTable([mob])
    const decrementAffects = new DecrementAffects(table)

    // when
    decrementAffects.notify()

    // then
    const affect1 = mob.affect().get(AffectType.Stunned) as AffectEntity
    expect(affect1.timeout).toBe(TEST_TIMEOUT_1 - 1)
    const affect2 = mob.affect().get(AffectType.Shield) as AffectEntity
    expect(affect2.timeout).toBe(TEST_TIMEOUT_2 - 1)
  })

  it("should remove an affect once it decrements to zero", async () => {
    // setup
    const mob = testRunner.createMob().get()
    mob.affect().add(newAffect(AffectType.Stunned, 0))
    const table = new MobTable([mob])
    const decrementAffects = new DecrementAffects(table)

    // when
    decrementAffects.notify()

    // then
    expect(mob.affects.length).toBe(0)
  })
})
