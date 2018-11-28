import { readFileSync, writeFileSync } from "fs"
import * as minimist from "minimist"
import ExitImportService from "../src/import/service/exitImportService"
import ImportService from "../src/import/service/importService"
import ResetImportService from "../src/import/service/resetImportService"
import { getItemRepository } from "../src/item/repository/item"
import { getItemRoomResetRepository } from "../src/item/repository/itemRoomReset"
import { getMobRepository } from "../src/mob/repository/mob"
import { getMobResetRepository } from "../src/mob/repository/mobReset"
import { getExitRepository } from "../src/room/repository/exit"
import { getRoomRepository } from "../src/room/repository/room"
import { initializeConnection } from "../src/support/db/connection"
import { getItemMobResetRepository } from "../src/item/repository/itemMobReset"

const listFile = readFileSync("fixtures/area/area-midgaard.lst").toString()
const areaFiles = listFile.split("\n")
const args = minimist(process.argv.slice(2))
const writeNewData = args.write === undefined ? false : args.write

initializeConnection().then(async () => {
  const importService = new ImportService(
    await getMobRepository(),
    await getRoomRepository(),
    await getItemRepository(),
    writeNewData)
  await parse(importService)
  writeFileSync("itemTypes.json",
    JSON.stringify(importService.getItemTypes().filter((value, index, self) => self.indexOf(value) === index)))
})

async function parse(importService: ImportService) {
  console.log("1 - parsing file")
  const areas = []
  for (const file of areaFiles) {
    console.log(`  - importing ${file}`)
    areas.push(await importService.parseAreaFile(file))
  }
  if (!writeNewData) {
    return
  }
  console.log("2 - exits")
  const exitMaterializer = new ExitImportService(
    await getRoomRepository(),
    await getExitRepository())
  const resetMaterializer = new ResetImportService(
    await getMobResetRepository(),
    await getItemRoomResetRepository(),
    await getItemMobResetRepository(),
    await getMobRepository(),
    await getItemRepository(),
    await getRoomRepository())
  for (const area of areas) {
    console.log(`  - generating exits & resets for ${area.filename}`)
    await exitMaterializer.materializeExits(area)
    await resetMaterializer.materializeResets(area)
  }
}
