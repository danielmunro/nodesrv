import { getTestRoom } from "../test/room"
import newServer from "./factory"

const DEFAULT_PORT = 1231

describe("game server factory", () => {
  it("should not start if passed a null room", () => {
    expect(() => newServer(null, DEFAULT_PORT)).toThrowError()
  })

  it("should not start if passed a bad port", () => {
    const startRoom = getTestRoom()
    expect(() => newServer(startRoom, 1)).toThrowError()
    expect(() => newServer(startRoom, 999999999)).toThrowError()
    expect(() => newServer(startRoom, 22)).toThrowError()
    expect(() => newServer(startRoom, null)).toThrowError()
  })
})
