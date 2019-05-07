import {ContainerModule} from "inversify"
import EventService from "../../event/eventService"
import ActionService from "../../gameService/actionService"
import GameService from "../../gameService/gameService"
import ResetService from "../../gameService/resetService"
import StateService from "../../gameService/stateService"
import TimeService from "../../gameService/timeService"
import ItemService from "../../item/itemService"
import FightBuilder from "../../mob/fight/fightBuilder"
import LocationService from "../../mob/locationService"
import MobService from "../../mob/mobService"
import EscrowService from "../../mob/trade/escrowService"
import WeatherService from "../../region/weatherService"
import ClientService from "../../server/clientService"
import {GameServer} from "../../server/server"
import AuthService from "../../session/auth/authService"
import {Types} from "../../support/types"

export default new ContainerModule(bind => {
  bind<EventService>(Types.EventService).to(EventService).inSingletonScope()
  bind<LocationService>(Types.LocationService).to(LocationService).inSingletonScope()
  bind<TimeService>(Types.TimeService).to(TimeService).inSingletonScope()
  bind<WeatherService>(Types.WeatherService).to(WeatherService).inSingletonScope()
  bind<MobService>(Types.MobService).to(MobService).inSingletonScope()
  bind<ItemService>(Types.ItemService).to(ItemService).inSingletonScope()
  bind<EscrowService>(Types.EscrowService).to(EscrowService).inSingletonScope()
  bind<AuthService>(Types.AuthService).to(AuthService).inSingletonScope()
  bind<ResetService>(Types.ResetService).to(ResetService).inSingletonScope()
  bind<StateService>(Types.StateService).to(StateService).inSingletonScope()
  bind<GameService>(Types.GameService).to(GameService).inSingletonScope()
  bind<ClientService>(Types.ClientService).to(ClientService).inSingletonScope()
  bind<ActionService>(Types.ActionService).to(ActionService).inSingletonScope()
  bind<GameServer>(Types.GameServer).to(GameServer).inSingletonScope()
  bind<FightBuilder>(Types.FightBuilder).to(FightBuilder).inSingletonScope()
})
