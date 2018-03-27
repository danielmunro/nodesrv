import { poll } from "./poll"
import { ShortIntervalTimer } from "./timer/shortIntervalTimer"

describe("polling", () => {
  it("should work", (done) => {
    poll(() => done(), new ShortIntervalTimer())
  })
})
