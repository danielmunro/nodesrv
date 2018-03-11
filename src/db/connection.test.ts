import { getConnection } from "./connection"

describe("connection", () => {
  it("should be recycled", () => {
    expect.assertions(1)
    return getConnection().then((connection1) =>
      getConnection().then((connection2) => expect(connection1).toBe(connection2)))
  })
})
