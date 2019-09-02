import { readFileSync } from "fs"
import minimist from "minimist"
import File from "../src/import/file"
import ItemBuilder from "../src/import/itemBuilder"
import ExitImportService from "../src/import/service/exitImportService"
import ImportService from "../src/import/service/importService"
import ResetImportService from "../src/import/service/resetImportService"
import ItemTable from "../src/import/table/itemTable"
import MobTable from "../src/import/table/mobTable"
import RoomTable from "../src/import/table/roomTable"
import { ItemEntity } from "../src/item/entity/itemEntity"
import { getItemRepository } from "../src/item/repository/item"
import { getItemContainerResetRepository } from "../src/item/repository/itemContainerReset"
import { getItemMobResetRepository } from "../src/item/repository/itemMobReset"
import { getItemRoomResetRepository } from "../src/item/repository/itemRoomReset"
import { getMobEquipResetRepository } from "../src/item/repository/mobEquipReset"
import { MobEntity } from "../src/mob/entity/mobEntity"
import { getMobRepository } from "../src/mob/repository/mob"
import { getMobResetRepository } from "../src/mob/repository/mobReset"
import { RoomEntity } from "../src/room/entity/roomEntity"
import { getExitRepository } from "../src/room/repository/exit"
import { getRoomRepository } from "../src/room/repository/room"
import { initializeConnection } from "../src/support/db/connection"

const listFile = readFileSync("fixtures/areas/area.lst").toString()
const areaFiles = listFile.split("\n")
// @ts-ignore
const args = minimist(process.argv.slice(2))
const writeNewData = args.write === undefined ? false : args.write
const fix = args.fix === undefined ? false : args.fix

if (writeNewData && fix) {
  console.error("cannot write data and fix descriptions")
  process.exit(1)
}

initializeConnection().then(async () =>
  await parse(new ImportService(
    await getMobRepository(),
    await getRoomRepository(),
    await getItemRepository(),
    ItemBuilder.new(),
    writeNewData)))

async function parse(importService: ImportService) {
  console.log("1 - parsing file")
  const areas: File[] = []
  const rowCount = areaFiles.length
  let i = 1
  const rooms: RoomEntity[] = []
  const items: ItemEntity[] = []
  const mobs: MobEntity[] = []
  for (const file of areaFiles) {
    console.log(`  - importing ${file} (${i}/${rowCount})`)
    const parsedArea = await importService.parseAreaFile(file)
    areas.push(parsedArea)
    rooms.push(...parsedArea.rooms)
    items.push(...parsedArea.items)
    mobs.push(...parsedArea.mobs)
    i++
  }
  if (fix) {
    const itemRepository = await getItemRepository()
    const itemEntities = await itemRepository.findAll()
    for (const itemPrototype of items) {
      const itemEntity = itemEntities.find(e => e.canonicalId === itemPrototype.canonicalId)
      if (itemEntity) {
        itemEntity.description = itemPrototype.description
        await itemRepository.save(itemEntity)
      }
    }
  }
  if (!writeNewData) {
    return
  }
  const itemTable = new ItemTable(items)
  const roomTable = new RoomTable(rooms)
  const mobTable = new MobTable(mobs)
  console.log("2 - exits")
  const exitMaterializer = new ExitImportService(
    roomTable,
    await getExitRepository())
  const resetMaterializer = new ResetImportService(
    await getMobResetRepository(),
    await getItemRoomResetRepository(),
    await getItemMobResetRepository(),
    await getMobEquipResetRepository(),
    await getItemContainerResetRepository(),
    mobTable,
    itemTable,
    roomTable)
  i = 1
  for (const area of areas) {
    console.log(`  - generating exits & resets for ${area.filename} (${i}/${rowCount})`)
    await exitMaterializer.materializeExits(area)
    await resetMaterializer.materializeResets(area)
    i++
  }
}
