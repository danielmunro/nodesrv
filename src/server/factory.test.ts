import GameService from "../gameService/gameService"
import MobService from "../mob/mobService"
import MobTable from "../mob/mobTable"
import { getMobRepository } from "../mob/repository/mob"
import { getTestRoom } from "../test/room"
import newServer from "./factory"
import ItemService from "../item/itemService"
import { getItemRepository } from "../item/repository/item"

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
