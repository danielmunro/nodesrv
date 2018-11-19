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

const listFile = readFileSync("fixtures/area/area-midgaard.lst").toString()
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
  const areas = await Promise.all(areaFiles.map(async area => importService.parseAreaFile(area)))
  const resetMaterializer = new ResetMaterializer(
    await getMobResetRepository(),
    await getItemResetRepository(),
    await getMobRepository(),
    await getItemRepository(),
    await getRoomRepository())

  await Promise.all(areas.map(async area => {
    return resetMaterializer.materializeResets(area)
    // await area.mobResets.forEach(async resetObject => {
    //   const room = await roomRepository.findOneByImportId(resetObject.roomId)
    //   const mob = await mobRepository.findOneByImportId(resetObject.mobId)
    //   await mobResetRepository.save(newMobReset(mob, room))
    // })
  }))
}
