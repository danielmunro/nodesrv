import Ac from "./model/ac"
import Attributes from "./model/attributes"
import Stats from "./model/stats"

const TEST_ATTRIBUTES_VALUE = 1

function getNewTestAttributes(): Attributes {
  const attributes = new Attributes()
  attributes.hit = TEST_ATTRIBUTES_VALUE
  attributes.dam = TEST_ATTRIBUTES_VALUE
  attributes.str = TEST_ATTRIBUTES_VALUE
  attributes.int = TEST_ATTRIBUTES_VALUE
  attributes.wis = TEST_ATTRIBUTES_VALUE
  attributes.dex = TEST_ATTRIBUTES_VALUE
  attributes.con = TEST_ATTRIBUTES_VALUE
  attributes.sta = TEST_ATTRIBUTES_VALUE
  attributes.stats = Stats.create(
    TEST_ATTRIBUTES_VALUE,
    TEST_ATTRIBUTES_VALUE,
    TEST_ATTRIBUTES_VALUE,
    TEST_ATTRIBUTES_VALUE,
    TEST_ATTRIBUTES_VALUE,
    TEST_ATTRIBUTES_VALUE)
  attributes.hp = TEST_ATTRIBUTES_VALUE
  attributes.mana = TEST_ATTRIBUTES_VALUE
  attributes.mv = TEST_ATTRIBUTES_VALUE
  attributes.acBash = TEST_ATTRIBUTES_VALUE
  attributes.acSlash = TEST_ATTRIBUTES_VALUE
  attributes.acPierce = TEST_ATTRIBUTES_VALUE
  attributes.acMagic = TEST_ATTRIBUTES_VALUE
  attributes.ac = Ac.create(TEST_ATTRIBUTES_VALUE, TEST_ATTRIBUTES_VALUE, TEST_ATTRIBUTES_VALUE, TEST_ATTRIBUTES_VALUE)

  return attributes
}

describe("attributes", () => {
  it("should be able to combine test attributes three times and each value should be multiplied accordingly", () => {
    const attrs = getNewTestAttributes()
      .combine(getNewTestAttributes())
      .combine(getNewTestAttributes())
    expect(attrs.hit).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.dam).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.str).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.int).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.wis).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.dex).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.con).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.sta).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.hp).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.mana).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.mv).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.acBash).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.acSlash).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.acPierce).toBe(TEST_ATTRIBUTES_VALUE * 3)
    expect(attrs.acMagic).toBe(TEST_ATTRIBUTES_VALUE * 3)
  })
})
