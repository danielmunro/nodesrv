import {AsyncContainerModule} from "inversify"
import {Server} from "ws"
import {ItemContainerReset} from "../../item/model/itemContainerReset"
import ItemMobReset from "../../item/model/itemMobReset"
import {ItemRoomReset} from "../../item/model/itemRoomReset"
import {MobEquipReset} from "../../item/model/mobEquipReset"
import MobReset from "../../mob/model/mobReset"
import {Room} from "../../room/model/room"
import {getTestRoom} from "../../support/test/room"
import {Types} from "../../support/types"

export default new AsyncContainerModule(async bind => {
  bind<Room>(Types.StartRoom).toDynamicValue(() =>
    getTestRoom()).inSingletonScope()
  bind<Server>(Types.WebSocketServer).toConstantValue(new Server({ noServer: true }))
  bind<MobReset[]>(Types.MobResets)
    .toConstantValue([])
  bind<ItemMobReset[]>(Types.ItemMobResets)
    .toConstantValue([])
  bind<ItemRoomReset[]>(Types.ItemRoomResets)
    .toConstantValue([])
  bind<MobEquipReset[]>(Types.MobEquipResets)
    .toConstantValue([])
  bind<ItemContainerReset[]>(Types.ItemContainerResets)
    .toConstantValue([])
})
