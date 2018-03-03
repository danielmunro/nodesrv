import { getTestMob } from "../test/mob"
import { saveMobs } from "./model"

describe("mob models", () => {
  it("should save and load with the same values", () => {
    const mobs = [
      getTestMob(),
      getTestMob(),
      getTestMob(),
    ]
    expect.assertions(1)
    return saveMobs(mobs)
      .then((rows) => expect(
        rows.map((row) => {delete row.id; return row}),
      ).toEqual(
        mobs.map((mob) => mob.getModel())))
  })
})
