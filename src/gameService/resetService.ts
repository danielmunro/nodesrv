import {inject, injectable} from "inversify"
import {cloneDeep} from "lodash"
import { ItemContainerResetEntity } from "../item/entity/itemContainerResetEntity"
import { ItemEntity } from "../item/entity/itemEntity"
import ItemMobResetEntity from "../item/entity/itemMobResetEntity"
import { ItemRoomResetEntity } from "../item/entity/itemRoomResetEntity"
import { MobEquipResetEntity } from "../item/entity/mobEquipResetEntity"
import ItemService from "../item/service/itemService"
import { MobEntity } from "../mob/entity/mobEntity"
import { default as MobReset } from "../mob/entity/mobResetEntity"
import MobService from "../mob/service/mobService"
import {RoomEntity} from "../room/entity/roomEntity"
import RoomTable from "../room/table/roomTable"
import {Types} from "../support/types"

@injectable()
export default class ResetService {
  constructor(
    @inject(Types.MobResets) private readonly mobResets: MobReset[],
    @inject(Types.ItemMobResets) private readonly itemMobResets: ItemMobResetEntity[],
    @inject(Types.ItemRoomResets) private readonly itemRoomResets: ItemRoomResetEntity[],
    @inject(Types.MobEquipResets) private readonly mobEquipResets: MobEquipResetEntity[],
    @inject(Types.ItemContainerResets) private readonly itemContainerResets: ItemContainerResetEntity[],
    @inject(Types.MobService) private readonly mobService: MobService,
    @inject(Types.RoomTable) private readonly roomTable: RoomTable,
    @inject(Types.ItemService) private readonly itemService: ItemService) {}

  public async pruneDeadMobs() {
    return this.mobService.pruneDeadMobs()
  }

  public async seedMobTable() {
    await Promise.all(this.mobResets.map(this.respawnFromMobReset.bind(this)))
  }

  public async seedItemRoomResets() {
    await Promise.all(this.itemRoomResets.map(this.respawnFromItemRoomReset.bind(this)))
  }

  public async respawnFromMob(mob: MobEntity) {
    const mobReset = this.mobResets.find(reset => reset.mob.uuid === mob.uuid)
    if (!mobReset) {
      throw new Error("no mob reset found")
    }
    await this.respawnFromMobReset(mobReset)
  }

  public async respawnFromMobReset(mobReset: MobReset) {
    const mob = await this.mobService.createMobFromReset(mobReset)
    const room = this.roomTable.get(mobReset.room.uuid)
    const mobsInRoom = this.mobService
      .getMobsByRoom(room).filter(m => m.canonicalId === mob.canonicalId)
    const mobsTotal = this.mobService.getMobsByImportId(mob.canonicalId)
    if (mobsInRoom.length < mobReset.maxPerRoom && mobsTotal.length < mobReset.maxQuantity) {
      await this.equipToMob(mob)
      await this.giveItemToMob(mob)
      await this.mobService.add(mob, room)
    }
  }

  private async respawnFromItemRoomReset(itemRoomReset: ItemRoomResetEntity) {
    const item = await this.itemService.generateNewItemInstance(itemRoomReset)
    const room = this.roomTable.get(itemRoomReset.room.uuid)
    const itemsInRoom = this.itemService.findAllByInventory(room.inventory)
      .filter(i => i.canonicalId === item.canonicalId)
    const itemsTotal = this.itemService.getByCanonicalId(item.canonicalId)
    if (itemsInRoom.length < itemRoomReset.maxPerRoom && itemsTotal.length < itemRoomReset.maxQuantity) {
      room.inventory.addItem(item)
      if (item.container) {
        await this.addToContainer(item, room)
      }
      this.itemService.add(item, room)
    }
  }

  private async giveItemToMob(mob: MobEntity) {
    for (const reset of this.itemMobResets) {
      if (reset.mob.canonicalId === mob.canonicalId) {
        const item = cloneDeep(reset.item)
        mob.inventory.addItem(item, mob)
        this.itemService.add(item, mob)
      }
    }
  }

  private async equipToMob(mob: MobEntity) {
    for (const mobEquipReset of this.mobEquipResets) {
      if (mobEquipReset.mob.canonicalId === mob.canonicalId) {
        const equipment = await this.itemService.generateNewItemInstance(mobEquipReset)
        mob.equipped.addItem(equipment, mob)
        this.itemService.add(equipment, mob)
        return
      }
    }
  }

  private async addToContainer(item: ItemEntity, room: RoomEntity) {
    for (const itemContainerReset of this.itemContainerResets) {
      if (itemContainerReset.item.canonicalId === item.canonicalId) {
        const instance = await this.itemService.generateNewItemInstance(itemContainerReset)
        item.container.addItem(instance, item)
        this.itemService.add(instance, room)
        return
      }
    }
  }
}
