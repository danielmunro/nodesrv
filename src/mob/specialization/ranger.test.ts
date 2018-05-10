import Ranger from "./ranger"
import { SpecializationType } from "./specializationType"

describe("rangers", () => {
  it("should get ranger specialization", () => {
    expect(new Ranger().getSpecializationType()).toBe(SpecializationType.Ranger)
  })
})
