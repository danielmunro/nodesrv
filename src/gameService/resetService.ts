import ItemService from "../item/itemService"
import { ItemRoomReset } from "../item/model/itemRoomReset"
import MobService from "../mob/mobService"
import { default as MobReset } from "../mob/model/mobReset"
import RoomTable from "../room/roomTable"

export default class ResetService {
  constructor(
    private readonly mobResets: MobReset[],
    private readonly itemRoomResets: ItemRoomReset[],
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
    this.mobService.add(mob, room)
  }

  private async respawnFromItemRoomReset(itemRoomReset: ItemRoomReset) {
    const item = await this.itemService.generateNewItemInstance(itemRoomReset)
    const room = this.roomTable.get(itemRoomReset.room.uuid)
    room.inventory.addItem(item)
  }
}
