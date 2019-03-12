import {Disposition} from "../../../../../mob/enum/disposition"
import {Race} from "../../../../../mob/race/race"
import {RequestType} from "../../../../../request/requestType"
import doNTimes from "../../../../../support/functional/times"
import TestBuilder from "../../../../../test/testBuilder"

let testBuilder: TestBuilder
const undeadCount = 5

beforeEach(() => {
  testBuilder = new TestBuilder()
})

describe("turn undead action", () => {
  it("kills undead mobs", async () => {
    // given
    const mobs = await doNTimes(undeadCount, () => testBuilder.withMob().setRace(Race.Undead))

    // when
    await doNTimes(10, () =>
      testBuilder.handleAction(RequestType.Cast, "cast turn"))

    // then
    expect(mobs.filter(mob => mob.disposition === Disposition.Dead)).toHaveLength(0)
  })

  it("does not kill mobs who are not undead", async () => {
    // given
    const mobs = await doNTimes(undeadCount, () => testBuilder.withMob())

    // when
    await doNTimes(10, () =>
      testBuilder.handleAction(RequestType.Cast, "cast turn"))

    // then
    expect(mobs.filter(mob => mob.disposition === Disposition.Dead)).toHaveLength(0)
  })
})
