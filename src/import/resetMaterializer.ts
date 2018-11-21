import ItemRepository from "../item/repository/item"
import ItemResetRepository from "../item/repository/itemReset"
import { newMobReset } from "../mob/factory"
import MobRepository from "../mob/repository/mob"
import MobResetRepository from "../mob/repository/mobReset"
import RoomRepository from "../room/repository/room"
import File from "./file"
import Reset from "./reset"
import MobReset from "../mob/model/mobReset"
import { ResetFlag } from "./resetFlag"
import ItemReset from "../item/model/itemReset"
import { newItemReset } from "../item/factory"

export default class ResetMaterializer {
  private lastMobReset: MobReset
  private lastItemReset: ItemReset

  constructor(
    public readonly mobResetRepository: MobResetRepository,
    public readonly itemResetRepository: ItemResetRepository,
    public readonly mobRepository: MobRepository,
    public readonly itemRepository: ItemRepository,
    public readonly roomRepository: RoomRepository,
  ) {}

  public async materializeResets(file: File) {
    console.log(`materialize resets for file ${file.filename}`)
    const resetCount = file.resets.length
    for (let i = 0; i < resetCount; i++) {
      const reset = file.resets[i]
      switch (reset.resetFlag) {
        case ResetFlag.Mob:
          await this.createMobRoomReset(reset)
          break
        case ResetFlag.Item:
          await this.createItemRoomReset(reset)
          break
        case ResetFlag.GiveItemToMob:
          await this.itemResetRepository.save(await this.createItemMobReset(reset))
          break
        case ResetFlag.EquipItemToMob:
          await this.itemResetRepository.save(await this.createItemEquipReset(reset))
          break
        case ResetFlag.PutItemInContainer:
          await this.itemResetRepository.save(await this.createItemContainerReset(reset))
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

  private async createMobRoomReset(reset: Reset): Promise<MobReset> {
    const room = await this.roomRepository.findOneByImportId(reset.idOfResetDestination)
    const mob = await this.mobRepository.findOneByImportId(reset.idOfResetSubject)
    if (!room) {
      console.log("destination missing", reset)
      return
    }
    if (!mob) {
      console.log("subject missing", reset)
      return
    }

    this.lastMobReset = newMobReset(mob, room)
    await this.mobResetRepository.save(this.lastMobReset)

    return this.lastMobReset
  }

  private async createItemRoomReset(reset: Reset): Promise<ItemReset> {
    const room = await this.roomRepository.findOneByImportId(reset.idOfResetDestination)
    const item = await this.itemRepository.findOneByImportId(reset.idOfResetSubject)
    if (!room) {
      console.log("destination missing", reset)
      return
    }
    if (!item) {
      console.log("subject missing", reset)
      return
    }

    this.lastItemReset = newItemReset(item, room.inventory)
    await this.itemResetRepository.save(this.lastItemReset)

    return this.lastItemReset
  }

  private async createItemMobReset(reset: Reset): Promise<ItemReset> {
    const item = await this.itemRepository.findOneByImportId(reset.idOfResetSubject)

    return newItemReset(item, this.lastMobReset.mob.inventory)
  }

  private async createItemEquipReset(reset: Reset): Promise<ItemReset> {
    const item = await this.itemRepository.findOneByImportId(reset.idOfResetSubject)

    return newItemReset(item, this.lastMobReset.mob.equipped.inventory)
  }

  private async createItemContainerReset(reset: Reset): Promise<ItemReset> {
    const item = await this.itemRepository.findOneByImportId(reset.idOfResetSubject)

    return newItemReset(item, this.lastItemReset.item.container.inventory)
  }
}
