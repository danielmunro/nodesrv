import { getTestRoom } from "../test/room"
import newServer from "./factory"
import Service from "../room/service"

describe("game server factory", () => {
  it("should not start if passed a bad port", async () => {
    const startRoom = getTestRoom()
    const service = await Service.new(startRoom)
    expect(() => newServer(service, 1)).toThrowError()
    expect(() => newServer(service, 999999999)).toThrowError()
    expect(() => newServer(service, 22)).toThrowError()
    expect(() => newServer(service, null)).toThrowError()
  })
})
