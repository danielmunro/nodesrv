import ItemService from "../item/itemService"
import { getItemContainerResetRepository } from "../item/repository/itemContainerReset"
import { getItemRoomResetRepository } from "../item/repository/itemRoomReset"
import { getMobEquipResetRepository } from "../item/repository/mobEquipReset"
import MobService from "../mob/mobService"
import { getMobResetRepository } from "../mob/repository/mobReset"
import { default as RoomTable } from "../room/roomTable"
import ResetService from "./resetService"
import {getItemMobResetRepository} from "../item/repository/itemMobReset"

export async function createResetService(
  mobService: MobService, roomTable: RoomTable, itemService: ItemService): Promise<ResetService> {
  const mobResetRepository = await getMobResetRepository()
  const itemMobResetRepository = await getItemMobResetRepository()
  const itemRoomResetRepository = await getItemRoomResetRepository()
  const mobEquipResetRepository = await getMobEquipResetRepository()
  const itemContainerResetRepository = await getItemContainerResetRepository()

  return new ResetService(
    await mobResetRepository.findAll(),
    await itemMobResetRepository.findAll(),
    await itemRoomResetRepository.findAll(),
    await mobEquipResetRepository.findAll(),
    await itemContainerResetRepository.findAll(),
    mobService,
    roomTable,
    itemService)
}
