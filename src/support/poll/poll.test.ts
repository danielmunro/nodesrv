import { ShortIntervalTimer } from "../timer/shortIntervalTimer"
import { poll } from "./poll"

describe("polling", () => {
  it("should work", (done) => {
    poll(() => done(), new ShortIntervalTimer())
  })
})
