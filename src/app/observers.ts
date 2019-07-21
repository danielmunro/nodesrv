import {Container} from "inversify"
import {DecrementAffects} from "../server/observers/decrementAffects"
import {DecrementPlayerDelay} from "../server/observers/decrementPlayerDelay"
import {FightRounds} from "../server/observers/fightRounds"
import {HandleClientRequests} from "../server/observers/handleClientRequests"
import {PersistPlayers} from "../server/observers/persistPlayers"
import {RegionWeather} from "../server/observers/regionWeather"
import Respawner from "../server/observers/respawner"
import {Tick} from "../server/observers/tick"
import {Wander} from "../server/observers/wander"
import {Types} from "../support/types"

export default class Observers {
  constructor(private readonly container: Container) {}

  public getTickObserver(): Tick {
    return this.container.get<Tick>(Types.TickObserver)
  }

  public getDecrementAffectsObserver(): DecrementAffects {
    return this.container.get<DecrementAffects>(Types.DecrementAffectObserver)
  }

  public getWanderObserver(): Wander {
    return this.container.get<Wander>(Types.WanderObserver)
  }

  public getPersistPlayersObserver(): PersistPlayers {
    return this.container.get<PersistPlayers>(Types.PersistPlayersObservers)
  }

  public getRegionWeatherObserver(): RegionWeather {
    return this.container.get<RegionWeather>(Types.RegionWeatherObserver)
  }

  public getFightRoundsObserver(): FightRounds {
    return this.container.get<FightRounds>(Types.FightRoundsObserver)
  }

  public getRespawnerObserver(): Respawner {
    return this.container.get<Respawner>(Types.RespawnerObserver)
  }

  public getDecrementPlayerDelayObserver(): DecrementPlayerDelay {
    return new DecrementPlayerDelay()
  }

  public getHandleClientRequestsObserver(): HandleClientRequests {
    return this.container.get<HandleClientRequests>(Types.HandleClientRequestsObserver)
  }
}
