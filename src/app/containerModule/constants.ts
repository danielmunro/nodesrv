import {AsyncContainerModule} from "inversify"
import {Producer} from "kafkajs"
import {Server} from "ws"
import {ItemContainerReset} from "../../item/model/itemContainerReset"
import ItemMobReset from "../../item/model/itemMobReset"
import {ItemRoomReset} from "../../item/model/itemRoomReset"
import {MobEquipReset} from "../../item/model/mobEquipReset"
import {getItemContainerResetRepository} from "../../item/repository/itemContainerReset"
import {getItemMobResetRepository} from "../../item/repository/itemMobReset"
import {getItemRoomResetRepository} from "../../item/repository/itemRoomReset"
import {getMobEquipResetRepository} from "../../item/repository/mobEquipReset"
import kafkaProducer from "../../kafka/kafkaProducer"
import MobReset from "../../mob/model/mobReset"
import {getMobResetRepository} from "../../mob/repository/mobReset"
import {RoomEntity} from "../../room/entity/roomEntity"
import RoomTable from "../../room/table/roomTable"
import {Types} from "../../support/types"

export default (startRoomId: number, port: number) => {
  console.log("loading constants")
  const constants = new AsyncContainerModule(async bind => {
    bind<RoomEntity>(Types.StartRoom).toDynamicValue(context =>
      context.container.get<RoomTable>(Types.RoomTable)
        .getRooms().find(r => r.canonicalId === startRoomId) as RoomEntity).inSingletonScope()
    bind<Server>(Types.WebSocketServer).toConstantValue(new Server({port}))
    bind<MobReset[]>(Types.MobResets)
      .toConstantValue(await (await getMobResetRepository()).findAll())
    bind<ItemMobReset[]>(Types.ItemMobResets)
      .toConstantValue(await (await getItemMobResetRepository()).findAll())
    bind<ItemRoomReset[]>(Types.ItemRoomResets)
      .toConstantValue(await (await getItemRoomResetRepository()).findAll())
    bind<MobEquipReset[]>(Types.MobEquipResets)
      .toConstantValue(await (await getMobEquipResetRepository()).findAll())
    bind<ItemContainerReset[]>(Types.ItemContainerResets)
      .toConstantValue(await (await getItemContainerResetRepository()).findAll())
    bind<Producer>(Types.KafkaProducer)
      .toConstantValue(await kafkaProducer("app", ["localhost:9092"]))
  })
  console.log("done loading constants")
  return constants
}
