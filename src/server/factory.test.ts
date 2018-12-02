import GameService from "../gameService/gameService"
import ItemService from "../item/itemService"
import MobService from "../mob/mobService"
import { getTestRoom } from "../test/room"
import newServer from "./factory"

describe("game server factory", () => {
  it("should not start if passed a bad port", async () => {
    const startRoom = getTestRoom()
    const service = await GameService.new(
      new MobService(), new ItemService())
    await expect(newServer(service, 1, startRoom, null, null)).rejects.toThrowError()
    await expect(newServer(service, 999999999, startRoom, null, null)).rejects.toThrowError()
    await expect(newServer(service, 22, startRoom, null, null)).rejects.toThrowError()
    await expect(newServer(service, null, startRoom, null, null)).rejects.toThrowError()
  })
})
