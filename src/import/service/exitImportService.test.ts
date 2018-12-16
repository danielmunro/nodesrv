import ItemBuilder from "../../item/itemBuilder"
import {getItemRepository} from "../../item/repository/item"
import {getMobRepository} from "../../mob/repository/mob"
import {getExitRepository} from "../../room/repository/exit"
import {getRoomRepository} from "../../room/repository/room"
import RoomTable from "../table/roomTable"
import ExitImportService from "./exitImportService"
import ImportService from "./importService"

describe("exit import service", () => {
  it("should materialize the expected number of exits", async () => {
    // given
    const importService = new ImportService(
        await getMobRepository(),
        await getRoomRepository(),
        await getItemRepository(),
        ItemBuilder.new())
    const file = await importService.parseAreaFile("areas/midgaard.are")
    const exitImportService = new ExitImportService(
        new RoomTable(file.rooms),
        await getExitRepository())

    // when
    const exits = await exitImportService.materializeExits(file)

    // then
    expect(exits).toHaveLength(371)
    exits.forEach(exit => {
      expect(exit.id).toBeDefined()
      expect(exit.direction).toBeDefined()
      expect(exit.source).toBeDefined()
    })
  }, 10000)
})
