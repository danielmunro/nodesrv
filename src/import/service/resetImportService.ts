import { newItemContainerReset, newItemMobReset, newItemRoomReset, newMobEquipReset } from "../../item/factory"
import ItemContainerResetRepository from "../../item/repository/itemContainerReset"
import ItemMobResetRepository from "../../item/repository/itemMobReset"
import ItemRoomResetRepository from "../../item/repository/itemRoomReset"
import MobEquipResetRepository from "../../item/repository/mobEquipReset"
import { newMobReset } from "../../mob/factory"
import MobResetRepository from "../../mob/repository/mobReset"
import { ResetFlag } from "../enum/resetFlag"
import File from "../file"
import Reset from "../reset"
import ItemTable from "../table/itemTable"
import MobTable from "../table/mobTable"
import RoomTable from "../table/roomTable"

export default class ResetImportService {
  /* tslint:disable */
  constructor(
    public readonly mobResetRepository: MobResetRepository,
    public readonly itemRoomResetRepository: ItemRoomResetRepository,
    public readonly itemMobResetRepository: ItemMobResetRepository,
    public readonly mobEquipResetRepository: MobEquipResetRepository,
    public readonly itemContainerResetRepository: ItemContainerResetRepository,
    public readonly mobTable: MobTable,
    public readonly itemTable: ItemTable,
    public readonly roomTable: RoomTable) {}

  public async materializeResets(file: File) {
    for (const reset of file.resets) {
      switch (reset.resetFlag) {
        case ResetFlag.Mob:
          await this.createMobRoomReset(reset)
          break
        case ResetFlag.Item:
          await this.createItemRoomReset(reset)
          break
        case ResetFlag.GiveItemToMob:
          await this.createItemMobReset(reset)
          break
        case ResetFlag.EquipItemToMob:
          await this.createMobEquipReset(reset)
          break
        case ResetFlag.PutItemInContainer:
          await this.createItemContainerReset(reset)
          break
        case ResetFlag.Door:
          break
        case ResetFlag.RandomRoomExits:
          break
        default:
          break
      }
    }
  }

  private async createItemMobReset(reset: Reset) {
    const item = await this.itemTable.getByImportId(reset.idOfResetSubject)
    const mob = await this.mobTable.getByImportId(reset.idOfResetDestination)
    if (!item || !mob) {
      console.log("bad item mob reset", reset)
      return
    }
    await this.itemMobResetRepository.save(newItemMobReset(item, mob, reset.maxQuantity, reset.maxPerRoom))
  }

  private async createMobEquipReset(reset: Reset) {
    const item = await this.itemTable.getByImportId(reset.idOfResetSubject)
    const mob = await this.mobTable.getByImportId(reset.idOfResetDestination)
    if (!item || !mob) {
      console.log("bad mob equip reset", reset)
      return
    }
    await this.mobEquipResetRepository.save(newMobEquipReset(item, mob, reset.maxQuantity, reset.maxPerRoom))
  }

  private async createItemContainerReset(reset: Reset) {
    const itemSubject = await this.itemTable.getByImportId(reset.idOfResetSubject)
    const itemDestination = await this.itemTable.getByImportId(reset.idOfResetDestination)

    if (!itemSubject || !itemDestination) {
      console.log("bad item container reset", reset)
      return
    }
    await this.itemContainerResetRepository.save(newItemContainerReset(itemSubject, itemDestination))
  }

  private async createMobRoomReset(reset: Reset) {
    const room = await this.roomTable.getByImportId(reset.idOfResetDestination)
    const mob = await this.mobTable.getByImportId(reset.idOfResetSubject)
    if (!room || !mob) {
      console.log("bad mob room reset", reset)
      return
    }

    await this.mobResetRepository.save(newMobReset(mob, room, reset.maxQuantity, reset.maxPerRoom))
  }

  private async createItemRoomReset(reset: Reset) {
    const room = await this.roomTable.getByImportId(reset.idOfResetDestination)
    const item = await this.itemTable.getByImportId(reset.idOfResetSubject)
    if (!item || !room) {
      console.log("bad item room reset", reset, !!item, !!room)
      return
    }
    await this.itemRoomResetRepository.save(newItemRoomReset(item, room, reset.maxQuantity, reset.maxPerRoom))
  }
}
