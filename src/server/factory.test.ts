import LocationService from "../mob/locationService"
import Service from "../service/service"
import { getTestRoom } from "../test/room"
import newServer from "./factory"

describe("game server factory", () => {
  it("should not start if passed a bad port", async () => {
    const startRoom = getTestRoom()
    const service = await Service.new(new LocationService([]))
    await expect(newServer(service, 1, startRoom, null, null)).rejects.toThrowError()
    await expect(newServer(service, 999999999, startRoom, null, null)).rejects.toThrowError()
    await expect(newServer(service, 22, startRoom, null, null)).rejects.toThrowError()
    await expect(newServer(service, null, startRoom, null, null)).rejects.toThrowError()
  })
})
