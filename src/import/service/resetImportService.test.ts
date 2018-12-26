import ItemBuilder from "../../item/itemBuilder"
import {getItemRepository} from "../../item/repository/item"
import {getItemContainerResetRepository} from "../../item/repository/itemContainerReset"
import {getItemMobResetRepository} from "../../item/repository/itemMobReset"
import {getItemRoomResetRepository} from "../../item/repository/itemRoomReset"
import {getMobEquipResetRepository} from "../../item/repository/mobEquipReset"
import {getMobRepository} from "../../mob/repository/mob"
import {getMobResetRepository} from "../../mob/repository/mobReset"
import {getRoomRepository} from "../../room/repository/room"
import {getConnection, initializeConnection} from "../../support/db/connection"
import ItemTable from "../table/itemTable"
import MobTable from "../table/mobTable"
import RoomTable from "../table/roomTable"
import ImportService from "./importService"
import ResetImportService from "./resetImportService"

beforeAll(async () => initializeConnection())
afterAll(async () => (await getConnection()).close())

describe("reset import service", () => {
  it("should create resets", async () => {
    // given
    const importService = new ImportService(
        await getMobRepository(),
        await getRoomRepository(),
        await getItemRepository(),
        ItemBuilder.new())
    const file = await importService.parseAreaFile("areas/midgaard.are")
    const resetImportService = new ResetImportService(
        await getMobResetRepository(),
        await getItemRoomResetRepository(),
        await getItemMobResetRepository(),
        await getMobEquipResetRepository(),
        await getItemContainerResetRepository(),
        new MobTable(file.mobs),
        new ItemTable(file.items),
        new RoomTable(file.rooms))

    // when
    const resets = await resetImportService.materializeResets(file)

    // then
    expect(resets).toHaveLength(408)
  }, 10000)
})
