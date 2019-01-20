import ItemService from "../item/itemService"
import { getItemContainerResetRepository } from "../item/repository/itemContainerReset"
import {getItemMobResetRepository} from "../item/repository/itemMobReset"
import { getItemRoomResetRepository } from "../item/repository/itemRoomReset"
import { getMobEquipResetRepository } from "../item/repository/mobEquipReset"
import MobService from "../mob/mobService"
import { getMobResetRepository } from "../mob/repository/mobReset"
import { default as RoomTable } from "../room/roomTable"
import ResetService from "./resetService"

export async function createResetService(
  mobService: MobService, roomTable: RoomTable, itemService: ItemService): Promise<ResetService> {
  const mobResetRepository = await getMobResetRepository()
  const itemMobResetRepository = await getItemMobResetRepository()
  const itemRoomResetRepository = await getItemRoomResetRepository()
  const mobEquipResetRepository = await getMobEquipResetRepository()
  const itemContainerResetRepository = await getItemContainerResetRepository()

  const [ mobResets, itemMobResets, itemRoomResets, mobEquipResets, itemContainerResets ] = await Promise.all([
    mobResetRepository.findAll(),
    itemMobResetRepository.findAll(),
    itemRoomResetRepository.findAll(),
    mobEquipResetRepository.findAll(),
    itemContainerResetRepository.findAll(),
  ])

  return new ResetService(
    mobResets,
    itemMobResets,
    itemRoomResets,
    mobEquipResets,
    itemContainerResets,
    mobService,
    roomTable,
    itemService)
}
