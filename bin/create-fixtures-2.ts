/* tslint:disable */
import { readFileSync } from "fs"
import { initializeConnection } from "../src/db/connection"
import { getExitRepository } from "../src/room/repository/exit"
import ImportService from "../src/import/importService"
import { getMobRepository } from "../src/mob/repository/mob"
import { getMobResetRepository } from "../src/mob/repository/mobReset"
import { getRoomRepository } from "../src/room/repository/room"
import { getItemRepository } from "../src/item/repository/item"
import ResetMaterializer from "../src/import/resetMaterializer"
import { getItemResetRepository } from "../src/item/repository/itemReset"

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
    console.log(`${file} processing now`)
    areas.push(await importService.parseAreaFile(areaFiles[i]))
  }
  console.log("2 - initialize reset materializer")
  const resetMaterializer = new ResetMaterializer(
    await getMobResetRepository(),
    await getItemResetRepository(),
    await getMobRepository(),
    await getItemRepository(),
    await getRoomRepository())
  console.log("3 - materialize resets")
  await Promise.all(areas.map(async area =>
    resetMaterializer.materializeResets(area)))
  console.log("4 - done")
}
