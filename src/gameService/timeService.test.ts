import TimeService from "./timeService"

describe("time service", () => {
  it("should accurately report time of day", () => {
    const timeService = new TimeService(40)
    expect(timeService.getCurrentTime()).toBe(16)
  })
})
