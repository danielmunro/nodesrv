import Attributes from "./model/attributes"
import Hitroll from "./model/hitroll"
import Stats from "./model/stats"
import Vitals from "./model/vitals"

const TEST_ATTRIBUTES_VALUE = 1

function getNewTestAttributes(): Attributes {
  const attributes = new Attributes()
  attributes.hitroll = Hitroll.create(TEST_ATTRIBUTES_VALUE, TEST_ATTRIBUTES_VALUE)
  attributes.stats = Stats.create(
    TEST_ATTRIBUTES_VALUE,
    TEST_ATTRIBUTES_VALUE,
    TEST_ATTRIBUTES_VALUE,
    TEST_ATTRIBUTES_VALUE,
    TEST_ATTRIBUTES_VALUE,
    TEST_ATTRIBUTES_VALUE)
  attributes.vitals = Vitals.create(TEST_ATTRIBUTES_VALUE, TEST_ATTRIBUTES_VALUE, TEST_ATTRIBUTES_VALUE)

  return attributes
}

describe("attributes", () => {
  it("should be able to combine test attributes three times and each value should be multiplied accordingly", () => {
    const attrs = getNewTestAttributes()
      .combine(getNewTestAttributes())
      .combine(getNewTestAttributes())
    expect(attrs.hitroll.hit).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.hitroll.dam).toBe(TEST_ATTRIBUTES_VALUE * 3)
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
