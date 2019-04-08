import {MAX_PRACTICE_LEVEL} from "../../../../mob/constants"
import {Disposition} from "../../../../mob/enum/disposition"
import {RaceType} from "../../../../mob/race/enum/raceType"
import {RequestType} from "../../../../request/requestType"
import {SpellType} from "../../../../spell/spellType"
import doNTimes from "../../../../support/functional/times"
import TestBuilder from "../../../../support/test/testBuilder"

let testBuilder: TestBuilder
const undeadCount = 10

beforeEach(() => {
  testBuilder = new TestBuilder()
  testBuilder.withMob()
    .withSpell(SpellType.TurnUndead, MAX_PRACTICE_LEVEL)
    .setLevel(30)
})

describe("turn undead action", () => {
  it("kills undead mobs", async () => {
    // given
    const mobs = await doNTimes(undeadCount, () => testBuilder.withMob().setRace(RaceType.Undead))

    // when
    await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, "cast turn"))

    // then
    expect(mobs.filter(mobBuilder => mobBuilder.mob.disposition === Disposition.Dead)).toHaveLength(undeadCount)
  })

  it("does not kill mobs who are not undead", async () => {
    // given
    const mobs = await doNTimes(undeadCount, () => testBuilder.withMob())

    // when
    await testBuilder.successfulAction(
      testBuilder.createRequest(RequestType.Cast, "cast turn"))

    // then
    expect(mobs.filter(mob => mob.disposition === Disposition.Dead)).toHaveLength(0)
  })
})
