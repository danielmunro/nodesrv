import {ContainerModule} from "inversify"
import {DecrementAffects} from "../../server/observers/decrementAffects"
import {FightRounds} from "../../server/observers/fightRounds"
import {HandleClientRequests} from "../../server/observers/handleClientRequests"
import {PersistPlayers} from "../../server/observers/persistPlayers"
import {RegionWeather} from "../../server/observers/regionWeather"
import Respawner from "../../server/observers/respawner"
import {Tick} from "../../server/observers/tick"
import {Wander} from "../../server/observers/wander"
import {Types} from "../../support/types"

export default new ContainerModule(bind => {
  bind<Tick>(Types.TickObserver).to(Tick).inSingletonScope()
  bind<DecrementAffects>(Types.DecrementAffectObserver).to(DecrementAffects).inSingletonScope()
  bind<Wander>(Types.WanderObserver).to(Wander).inSingletonScope()
  bind<RegionWeather>(Types.RegionWeatherObserver).to(RegionWeather).inSingletonScope()
  bind<FightRounds>(Types.FightRoundsObserver).to(FightRounds).inSingletonScope()
  bind<Respawner>(Types.RespawnerObserver).to(Respawner).inSingletonScope()
  bind<PersistPlayers>(Types.PersistPlayersObservers).to(PersistPlayers).inSingletonScope()
  bind<HandleClientRequests>(Types.HandleClientRequestsObserver).to(HandleClientRequests).inSingletonScope()
})
