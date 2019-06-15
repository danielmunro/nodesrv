import { SpecializationType } from "../enum/specializationType"
import Ranger from "./ranger"

describe("rangers", () => {
  it("should get thief specializationType", () => {
    expect(new Ranger().getSpecializationType()).toBe(SpecializationType.Ranger)
  })
})
