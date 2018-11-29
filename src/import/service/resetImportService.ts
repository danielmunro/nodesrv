import { newItemMobReset, newItemRoomReset } from "../../item/factory"
import ItemMobResetRepository from "../../item/repository/itemMobReset"
import ItemRoomResetRepository from "../../item/repository/itemRoomReset"
import { newMobReset } from "../../mob/factory"
import MobResetRepository from "../../mob/repository/mobReset"
import { ResetFlag } from "../enum/resetFlag"
import File from "../file"
import Reset from "../reset"
import ItemTable from "../table/itemTable"
import MobTable from "../table/mobTable"
import RoomTable from "../table/roomTable"

export default class ResetImportService {
  constructor(
    public readonly mobResetRepository: MobResetRepository,
    public readonly itemRoomResetRepository: ItemRoomResetRepository,
    public readonly itemMobResetRepository: ItemMobResetRepository,
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
          // await this.createItemEquipReset(reset)
          break
        case ResetFlag.PutItemInContainer:
          // await this.createItemContainerReset(reset)
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
    await this.itemMobResetRepository.save(newItemMobReset(item, mob))
  }

  private async createMobRoomReset(reset: Reset) {
    const room = await this.roomTable.getByImportId(reset.idOfResetDestination)
    const mob = await this.mobTable.getByImportId(reset.idOfResetSubject)
    if (!room || !mob) {
      console.log("bad mob room reset", reset)
      return
    }
    await this.mobResetRepository.save(newMobReset(mob, room))
  }

  private async createItemRoomReset(reset: Reset) {
    const room = await this.roomTable.getByImportId(reset.idOfResetDestination)
    const item = await this.itemTable.getByImportId(reset.idOfResetSubject)
    if (!item || !room) {
      console.log("bad item room reset", reset, !!item, !!room)
      return
    }
    await this.itemRoomResetRepository.save(newItemRoomReset(item, room))
  }
}
