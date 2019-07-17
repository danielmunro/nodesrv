import {AsyncContainerModule} from "inversify"
import {Producer} from "kafkajs"
import * as Stripe from "stripe"
import {Server} from "ws"
import {ItemContainerResetEntity} from "../../item/entity/itemContainerResetEntity"
import ItemMobResetEntity from "../../item/entity/itemMobResetEntity"
import {ItemRoomResetEntity} from "../../item/entity/itemRoomResetEntity"
import {MobEquipResetEntity} from "../../item/entity/mobEquipResetEntity"
import {getItemContainerResetRepository} from "../../item/repository/itemContainerReset"
import {getItemMobResetRepository} from "../../item/repository/itemMobReset"
import {getItemRoomResetRepository} from "../../item/repository/itemRoomReset"
import {getMobEquipResetRepository} from "../../item/repository/mobEquipReset"
import kafkaProducer from "../../kafka/kafkaProducer"
import MobResetEntity from "../../mob/entity/mobResetEntity"
import {getMobResetRepository} from "../../mob/repository/mobReset"
import {RoomEntity} from "../../room/entity/roomEntity"
import RoomTable from "../../room/table/roomTable"
import {Types} from "../../support/types"
import {Timings} from "../constants"
import {Environment} from "../enum/environment"

export default (
  stripeApiKey: string, stripePlanId: string, environment: Environment, startRoomId: number, port: number) => {
  console.time(Timings.constants)
  const constants = new AsyncContainerModule(async bind => {
    bind<RoomEntity>(Types.StartRoom).toDynamicValue(context =>
      context.container.get<RoomTable>(Types.RoomTable)
        .getRooms().find(r => r.canonicalId === startRoomId) as RoomEntity).inSingletonScope()
    bind<Server>(Types.WebSocketServer).toConstantValue(new Server({port}))
    bind<MobResetEntity[]>(Types.MobResets)
      .toConstantValue(await (await getMobResetRepository()).findAll())
    bind<ItemMobResetEntity[]>(Types.ItemMobResets)
      .toConstantValue(await (await getItemMobResetRepository()).findAll())
    bind<ItemRoomResetEntity[]>(Types.ItemRoomResets)
      .toConstantValue(await (await getItemRoomResetRepository()).findAll())
    bind<MobEquipResetEntity[]>(Types.MobEquipResets)
      .toConstantValue(await (await getMobEquipResetRepository()).findAll())
    bind<ItemContainerResetEntity[]>(Types.ItemContainerResets)
      .toConstantValue(await (await getItemContainerResetRepository()).findAll())
    bind<Producer>(Types.KafkaProducer)
      .toConstantValue(await kafkaProducer("app", ["localhost:9092"]))
    bind<Stripe>(Types.StripeClient).toConstantValue(new Stripe(stripeApiKey))
    bind<string>(Types.StripePlanId).toConstantValue(stripePlanId)
    bind<Environment>(Types.Environment).toConstantValue(environment)
  })
  console.timeEnd(Timings.constants)
  return constants
}
