import { Attributes } from "./attributes"
import { HitDam } from "./hitdam"
import { Stats } from "./stats"
import { Vitals } from "./vitals"

const TEST_ATTRIBUTES_VALUE = 1

function getNewTestAttributes(): Attributes {
  return new Attributes(
    new HitDam(TEST_ATTRIBUTES_VALUE, TEST_ATTRIBUTES_VALUE),
    new Stats(
      TEST_ATTRIBUTES_VALUE,
      TEST_ATTRIBUTES_VALUE,
      TEST_ATTRIBUTES_VALUE,
      TEST_ATTRIBUTES_VALUE,
      TEST_ATTRIBUTES_VALUE,
      TEST_ATTRIBUTES_VALUE),
    new Vitals(TEST_ATTRIBUTES_VALUE, TEST_ATTRIBUTES_VALUE, TEST_ATTRIBUTES_VALUE))
}

describe("attributes", () => {
  it("should be able to combine test attributes three times and each value should be multiplied accordingly", () => {
    const attrs = getNewTestAttributes()
      .combine(getNewTestAttributes())
      .combine(getNewTestAttributes())
    expect(attrs.hitDam.hit).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.hitDam.dam).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.stats.str).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.stats.int).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.stats.wis).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.stats.dex).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.stats.con).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.stats.sta).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.vitals.hp).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.vitals.mana).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.vitals.mv).toBe(TEST_ATTRIBUTES_VALUE * 3)
  })
})
