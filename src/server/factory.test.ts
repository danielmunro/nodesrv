import EventService from "../event/eventService"
import GameService from "../gameService/gameService"
import ItemService from "../item/itemService"
import MobService from "../mob/mobService"
import ExitTable from "../room/exitTable"
import RoomTable from "../room/roomTable"
import { getTestRoom } from "../test/room"
import newServer from "./factory"

describe("game server factory", () => {
  it("should not start if passed a bad port", async () => {
    const startRoom = getTestRoom()
    const service = new GameService(
      new MobService(),
      new RoomTable(),
      new ItemService(),
      new ExitTable(null),
      new EventService())
    await expect(newServer(
      service, 1, startRoom, null, null, new EventService(), null)).rejects.toThrowError()
    await expect(newServer(
      service, 999999999, startRoom, null, null, new EventService(), null)).rejects.toThrowError()
    await expect(newServer(
      service, 22, startRoom, null, null, new EventService(), null)).rejects.toThrowError()
    await expect(newServer(
      service, null, startRoom, null, null, new EventService(), null)).rejects.toThrowError()
  })
})
