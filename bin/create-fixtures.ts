import { readFileSync } from "fs"
import { initializeConnection } from "../src/support/db/connection"
import ExitImportService from "../src/import/service/exitImportService"
import ImportService from "../src/import/service/importService"
import ResetImportService from "../src/import/service/resetImportService"
import { getContainerRepository } from "../src/item/repository/container"
import { getItemRepository } from "../src/item/repository/item"
import { getItemResetRepository } from "../src/item/repository/itemReset"
import { getMobRepository } from "../src/mob/repository/mob"
import { getMobResetRepository } from "../src/mob/repository/mobReset"
import { getExitRepository } from "../src/room/repository/exit"
import { getRoomRepository } from "../src/room/repository/room"

const listFile = readFileSync("fixtures/area/area.lst").toString()
const areaFiles = listFile.split("\n")

initializeConnection().then(async () => {
  const importService = new ImportService(
    await getMobRepository(),
    await getRoomRepository(),
    await getExitRepository(),
    await getItemRepository(),
  )
  await parse(importService)
})

async function parse(importService: ImportService) {
  console.log("1 - parsing file")
  const areaLength = areaFiles.length
  const areas = []
  for (let i = 0; i < areaLength; i++) {
    const file = areaFiles[i]
    console.log(`  - importing ${file}`)
    areas.push(await importService.parseAreaFile(areaFiles[i]))
  }

  console.log("2 - exits")
  const exitMaterializer = new ExitImportService(
    await getRoomRepository(),
    await getExitRepository())
  const resetMaterializer = new ResetImportService(
    await getMobResetRepository(),
    await getItemResetRepository(),
    await getMobRepository(),
    await getItemRepository(),
    await getRoomRepository(),
    await getContainerRepository())
  for (let i = 0; i < areaLength; i++) {
    const area = areas[i]
    console.log(`  - generating exits & resets for ${area.filename}`)
    await exitMaterializer.materializeExits(area)
    await resetMaterializer.materializeResets(area)
  }
}
