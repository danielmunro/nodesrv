import { newItemReset } from "../item/factory"
import ItemReset from "../item/model/itemReset"
import ContainerRepository from "../item/repository/container"
import ItemRepository from "../item/repository/item"
import ItemResetRepository from "../item/repository/itemReset"
import { newMobReset } from "../mob/factory"
import MobReset from "../mob/model/mobReset"
import MobRepository from "../mob/repository/mob"
import MobResetRepository from "../mob/repository/mobReset"
import RoomRepository from "../room/repository/room"
import File from "./file"
import Reset from "./reset"
import { ResetFlag } from "./resetFlag"

export default class ResetMaterializer {
  private lastMobReset: MobReset
  private lastItemReset: ItemReset

  constructor(
    public readonly mobResetRepository: MobResetRepository,
    public readonly itemResetRepository: ItemResetRepository,
    public readonly mobRepository: MobRepository,
    public readonly itemRepository: ItemRepository,
    public readonly roomRepository: RoomRepository,
    public readonly containerRepository: ContainerRepository,
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
          await this.createItemMobReset(reset)
          break
        case ResetFlag.EquipItemToMob:
          await this.createItemEquipReset(reset)
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

  private async createMobRoomReset(reset: Reset): Promise<MobReset> {
    const room = await this.roomRepository.findOneByImportId(reset.idOfResetDestination)
    const mob = await this.mobRepository.findOneByImportId(reset.idOfResetSubject)
    if (!room) {
      return
    }
    if (!mob) {
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
      return
    }
    if (!item) {
      return
    }
    this.lastItemReset = newItemReset(item, room.inventory)
    await this.itemResetRepository.save(this.lastItemReset)

    return this.lastItemReset
  }

  private async createItemMobReset(reset: Reset): Promise<ItemReset> {
    const item = await this.itemRepository.findOneByImportId(reset.idOfResetSubject)
    if (!item) {
      return
    }
    if (!this.lastMobReset) {
      return
    }
    const mob = await this.mobRepository.findOneById(this.lastMobReset.mob.id)
    const itemReset = newItemReset(item, mob.inventory)
    await this.itemResetRepository.save(itemReset)

    return itemReset
  }

  private async createItemEquipReset(reset: Reset): Promise<ItemReset> {
    const item = await this.itemRepository.findOneByImportId(reset.idOfResetSubject)
    if (!item) {
      return
    }
    if (!this.lastMobReset) {
      return
    }
    const mob = await this.mobRepository.findOneById(this.lastMobReset.mob.id)
    const itemReset = newItemReset(item, mob.inventory)
    await this.itemResetRepository.save(itemReset)

    return itemReset
  }

  private async createItemContainerReset(reset: Reset): Promise<ItemReset> {
    const item = await this.itemRepository.findOneByImportId(reset.idOfResetSubject)
    if (!item) {
      return
    }
    if (!this.lastItemReset) {
      return
    }
    const container = await this.containerRepository.findOneById(this.lastItemReset.item.container.id)
    if (!container) {
      console.error("unknown item container for reset", reset)
      return
    }
    const itemReset = newItemReset(item, container.inventory)
    await this.itemResetRepository.save(itemReset)

    return itemReset
  }
}
