import {ItemContainerResetEntity} from "../../item/entity/itemContainerResetEntity"
import {ItemRoomResetEntity} from "../../item/entity/itemRoomResetEntity"
import {MobEquipResetEntity} from "../../item/entity/mobEquipResetEntity"
import {
  newItemContainerReset,
  newItemMobReset,
  newItemRoomReset,
  newMobEquipReset } from "../../item/factory/itemFactory"
import ItemContainerResetRepository from "../../item/repository/itemContainerReset"
import ItemMobResetRepository from "../../item/repository/itemMobReset"
import ItemRoomResetRepository from "../../item/repository/itemRoomReset"
import MobEquipResetRepository from "../../item/repository/mobEquipReset"
import MobResetEntity from "../../mob/entity/mobResetEntity"
import { newMobReset } from "../../mob/factory/mobFactory"
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
    const resets = []
    console.log("file resets", file.resets.length)
    for (const reset of file.resets) {
      switch (reset.resetFlag) {
        case ResetFlag.Mob:
          try {
            resets.push(await this.createMobRoomReset(reset))
          } catch (error) {
            console.log("error with mob", error)
          }
          break
        case ResetFlag.Item:
          try {
            resets.push(await this.createItemRoomReset(reset))
          } catch (error) {
            console.log("error with item", error)
          }
          break
        case ResetFlag.GiveItemToMob:
          try {
            resets.push(await this.createItemMobReset(reset))
          } catch (error) {
            console.log("error with give item to mob", error)
          }
          break
        case ResetFlag.EquipItemToMob:
          try {
            resets.push(await this.createMobEquipReset(reset))
          } catch (error) {
            console.log("error with equip item to mob", error)
          }
          break
        case ResetFlag.PutItemInContainer:
          try {
            resets.push(await this.createItemContainerReset(reset))
          } catch (error) {
            console.log("error with put item in container", error)
          }
          break
        case ResetFlag.Door:
          break
        case ResetFlag.RandomRoomExits:
          break
        default:
          break
      }
    }
    return resets
  }

  private async createItemMobReset(reset: Reset): Promise<MobResetEntity> {
    const item = this.itemTable.getByImportId(reset.idOfResetSubject)
    const mob = this.mobTable.getByImportId(reset.idOfResetDestination)
    if (!item || !mob) {
      throw new Error("bad item mob reset: item: " + !!item + ", mob: " + !!mob)
    }
    return this.itemMobResetRepository.save(newItemMobReset(item, mob, reset.maxQuantity, reset.maxPerRoom))
  }

  private async createMobEquipReset(reset: Reset): Promise<MobEquipResetEntity> {
    const item = this.itemTable.getByImportId(reset.idOfResetSubject)
    const mob = this.mobTable.getByImportId(reset.idOfResetDestination)
    if (!item || !mob) {
      throw new Error("bad mob equip reset")
    }
    return this.mobEquipResetRepository.save(newMobEquipReset(item, mob, reset.maxQuantity, reset.maxPerRoom))
  }

  private async createItemContainerReset(reset: Reset): Promise<ItemContainerResetEntity> {
    const itemSubject = this.itemTable.getByImportId(reset.idOfResetSubject)
    const itemDestination = this.itemTable.getByImportId(reset.idOfResetDestination)

    if (!itemSubject || !itemDestination) {
      throw new Error("bad item container reset")
    }
    return this.itemContainerResetRepository.save(newItemContainerReset(itemSubject, itemDestination))
  }

  private async createMobRoomReset(reset: Reset): Promise<MobResetEntity> {
    const room = this.roomTable.getByImportId(reset.idOfResetDestination)
    const mob = this.mobTable.getByImportId(reset.idOfResetSubject)
    if (!room || !mob) {
      throw new Error("bad mob room reset")
    }

    return this.mobResetRepository.save(newMobReset(mob, room, reset.maxQuantity, reset.maxPerRoom))
  }

  private async createItemRoomReset(reset: Reset): Promise<ItemRoomResetEntity> {
    const room = this.roomTable.getByImportId(reset.idOfResetDestination)
    const item = this.itemTable.getByImportId(reset.idOfResetSubject)
    if (!item || !room) {
      throw new Error("bad item room reset")
    }
    return this.itemRoomResetRepository.save(newItemRoomReset(item, room, reset.maxQuantity, reset.maxPerRoom))
  }
}
