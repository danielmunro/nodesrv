import {ContainerModule} from "inversify"
import ActionService from "../../action/service/actionService"
import EventService from "../../event/service/eventService"
import GameService from "../../gameService/gameService"
import ResetService from "../../gameService/resetService"
import StateService from "../../gameService/stateService"
import TimeService from "../../gameService/timeService"
import ItemService from "../../item/service/itemService"
import WeaponEffectService from "../../item/service/weaponEffectService"
import KafkaService from "../../kafka/kafkaService"
import FightBuilder from "../../mob/fight/fightBuilder"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import SpecializationService from "../../mob/specialization/service/specializationService"
import EscrowService from "../../mob/trade/escrowService"
import PaymentService from "../../player/service/paymentService"
import PlayerService from "../../player/service/playerService"
import WeatherService from "../../region/service/weatherService"
import ClientService from "../../server/service/clientService"
import {GameServerService} from "../../server/service/gameServerService"
import CreationService from "../../session/auth/service/creationService"
import {Types} from "../../support/types"

export default new ContainerModule(bind => {
  bind<EventService>(Types.EventService).to(EventService).inSingletonScope()
  bind<LocationService>(Types.LocationService).to(LocationService).inSingletonScope()
  bind<TimeService>(Types.TimeService).to(TimeService).inSingletonScope()
  bind<WeatherService>(Types.WeatherService).to(WeatherService).inSingletonScope()
  bind<MobService>(Types.MobService).to(MobService).inSingletonScope()
  bind<ItemService>(Types.ItemService).to(ItemService).inSingletonScope()
  bind<EscrowService>(Types.EscrowService).to(EscrowService).inSingletonScope()
  bind<CreationService>(Types.CreationService).to(CreationService).inSingletonScope()
  bind<ResetService>(Types.ResetService).to(ResetService).inSingletonScope()
  bind<StateService>(Types.StateService).to(StateService).inSingletonScope()
  bind<GameService>(Types.GameService).to(GameService).inSingletonScope()
  bind<ClientService>(Types.ClientService).to(ClientService).inSingletonScope()
  bind<ActionService>(Types.ActionService).to(ActionService).inSingletonScope()
  bind<GameServerService>(Types.GameServer).to(GameServerService).inSingletonScope()
  bind<FightBuilder>(Types.FightBuilder).to(FightBuilder).inSingletonScope()
  bind<SpecializationService>(Types.SpecializationService).to(SpecializationService).inSingletonScope()
  bind<KafkaService>(Types.KafkaService).to(KafkaService).inSingletonScope()
  bind<WeaponEffectService>(Types.WeaponEffectService).to(WeaponEffectService).inSingletonScope()
  bind<PaymentService>(Types.PaymentService).to(PaymentService).inSingletonScope()
  bind<PlayerService>(Types.PlayerService).to(PlayerService).inSingletonScope()
})
