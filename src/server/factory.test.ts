import EventService from "../event/eventService"
import { getTestRoom } from "../support/test/room"
import newServer from "./factory"

describe("game server factory", () => {
  it("should not start if passed a bad port", async () => {
    const startRoom = getTestRoom()
    await expect(newServer(
      1, startRoom, null, null, new EventService(), null, null)).rejects.toThrowError()
    await expect(newServer(
      999999999, startRoom, null, null, new EventService(), null, null)).rejects.toThrowError()
    await expect(newServer(
      22, startRoom, null, null, new EventService(), null, null)).rejects.toThrowError()
    await expect(newServer(
      null, startRoom, null, null, new EventService(), null, null)).rejects.toThrowError()
  })
})
