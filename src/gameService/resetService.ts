import ItemService from "../item/itemService"
import { Item } from "../item/model/item"
import { ItemContainerReset } from "../item/model/itemContainerReset"
import { ItemRoomReset } from "../item/model/itemRoomReset"
import { MobEquipReset } from "../item/model/mobEquipReset"
import MobService from "../mob/mobService"
import { Mob } from "../mob/model/mob"
import { default as MobReset } from "../mob/model/mobReset"
import RoomTable from "../room/roomTable"

export default class ResetService {
  constructor(
    private readonly mobResets: MobReset[],
    private readonly itemRoomResets: ItemRoomReset[],
    private readonly mobEquipResets: MobEquipReset[],
    private readonly itemContainerResets: ItemContainerReset[],
    private readonly mobService: MobService,
    private readonly roomTable: RoomTable,
    private readonly itemService: ItemService) {}

  public async pruneDeadMobs() {
    return this.mobService.pruneDeadMobs()
  }

  public async seedMobTable() {
    await Promise.all(this.mobResets.map(this.respawnFromMobReset.bind(this)))
  }

  public async seedItemRoomResets() {
    await Promise.all(this.itemRoomResets.map(this.respawnFromItemRoomReset.bind(this)))
  }

  private async respawnFromMobReset(mobReset: MobReset) {
    const mob = await this.mobService.generateNewMobInstance(mobReset)
    const room = this.roomTable.get(mobReset.room.uuid)
    const mobsInRoom = this.mobService.locationService
      .getMobsByRoom(room).filter(m => m.importId === mob.importId)
    const mobsTotal = this.mobService.locationService
      .getMobsByImportId(mob.importId)
    if (mobsInRoom.length < mobReset.maxPerRoom && mobsTotal.length < mobReset.maxQuantity) {
      await this.equipToMob(mob)
      this.mobService.add(mob, room)
    }
  }

  private async respawnFromItemRoomReset(itemRoomReset: ItemRoomReset) {
    const item = await this.itemService.generateNewItemInstance(itemRoomReset)
    const room = this.roomTable.get(itemRoomReset.room.uuid)
    const itemsInRoom = this.itemService.findAllByInventory(room.inventory).filter(i => i.importId === item.importId)
    const itemsTotal = this.itemService.getByImportId(item.importId)
    if (itemsInRoom.length < itemRoomReset.maxPerRoom && itemsTotal.length < itemRoomReset.maxQuantity) {
      room.inventory.addItem(item)
      if (item.container) {
        await this.addToContainer(item)
      }
      this.itemService.add(item)
    }
  }

  private async equipToMob(mob: Mob) {
    for (const mobEquipReset of this.mobEquipResets) {
      if (mobEquipReset.mob.importId === mob.importId) {
        const equipment = await this.itemService.generateNewItemInstance(mobEquipReset)
        mob.equipped.addItem(equipment)
        this.itemService.add(equipment)
        return
      }
    }
  }

  private async addToContainer(item: Item) {
    for (const itemContainerReset of this.itemContainerResets) {
      if (itemContainerReset.item.importId === item.importId) {
        const instance = await this.itemService.generateNewItemInstance(itemContainerReset)
        item.container.addItem(instance)
        this.itemService.add(instance)
        return
      }
    }
  }
}
