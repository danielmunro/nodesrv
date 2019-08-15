import {AsyncContainerModule} from "inversify"
import {MessagePayload, Producer} from "kafkajs"
import Stripe from "stripe"
import {Server} from "ws"
import {ItemContainerResetEntity} from "../../item/entity/itemContainerResetEntity"
import ItemMobResetEntity from "../../item/entity/itemMobResetEntity"
import {ItemRoomResetEntity} from "../../item/entity/itemRoomResetEntity"
import {MobEquipResetEntity} from "../../item/entity/mobEquipResetEntity"
import MobResetEntity from "../../mob/entity/mobResetEntity"
import {RoomEntity} from "../../room/entity/roomEntity"
import {getTestRoom} from "../../support/test/room"
import {Types} from "../../support/types"
import {Environment} from "../enum/environment"

export default new AsyncContainerModule(async bind => {
  bind<RoomEntity>(Types.StartRoom).toDynamicValue(() =>
    getTestRoom()).inSingletonScope()
  bind<Server>(Types.WebSocketServer).toConstantValue(new Server({ noServer: true }))
  bind<MobResetEntity[]>(Types.MobResets)
    .toConstantValue([])
  bind<ItemMobResetEntity[]>(Types.ItemMobResets)
    .toConstantValue([])
  bind<ItemRoomResetEntity[]>(Types.ItemRoomResets)
    .toConstantValue([])
  bind<MobEquipResetEntity[]>(Types.MobEquipResets)
    .toConstantValue([])
  bind<ItemContainerResetEntity[]>(Types.ItemContainerResets)
    .toConstantValue([])
  bind<Producer>(Types.KafkaProducer)
    .toConstantValue({
      async send(payload: MessagePayload): Promise<void> {
        console.log("payload", payload)
      },
    } as any)
  bind<Stripe>(Types.StripeClient).toConstantValue({
    customers: {
      create: () => ({}),
      createSource: () => ({}),
      deleteSource: () => ({}),
    },
  } as any)
  bind<string>(Types.StripePlanId).toConstantValue("abc")
  bind<Environment>(Types.Environment).toConstantValue(Environment.Testing)
})
