import EventService from "../event/eventService"
import ResetService from "../gameService/resetService"
import StateService from "../gameService/stateService"
import LocationService from "../mob/locationService"
import MobService from "../mob/mobService"
import {getMobRepository} from "../mob/repository/mob"
import {getPlayerRepository} from "../player/repository/player"
import { DiceRoller } from "../support/random/dice"
import { FiveMinuteTimer } from "../support/timer/fiveMinuteTimer"
import { MinuteTimer } from "../support/timer/minuteTimer"
import { RandomTickTimer } from "../support/timer/randomTickTimer"
import { SecondIntervalTimer } from "../support/timer/secondTimer"
import {ShortIntervalTimer} from "../support/timer/shortIntervalTimer"
import { tick } from "./constants"
import { DecrementAffects } from "./observers/decrementAffects"
import {DecrementPlayerDelay} from "./observers/decrementPlayerDelay"
import { FightRounds } from "./observers/fightRounds"
import {HandleClientRequests} from "./observers/handleClientRequests"
import { ObserverChain } from "./observers/observerChain"
import { PersistPlayers } from "./observers/persistPlayers"
import { RegionWeather } from "./observers/regionWeather"
import Respawner from "./observers/respawner"
import { Tick } from "./observers/tick"
import { Wander } from "./observers/wander"
import { GameServer } from "./server"

export default async function addObservers(
  gameServer: GameServer,
  resetService: ResetService,
  eventService: EventService,
  mobService: MobService,
  locationService: LocationService,
  stateService: StateService): Promise<GameServer> {
  gameServer.addObserver(
    new ObserverChain([
      new Tick(stateService.timeService, eventService, locationService),
      new DecrementAffects(mobService.mobTable),
      new Wander(mobService.mobTable.getWanderingMobs(), locationService),
    ]),
    new RandomTickTimer(
      new DiceRoller(tick.dice.sides, tick.dice.rolls, tick.dice.modifier)))
  gameServer.addObserver(new PersistPlayers(
    await getPlayerRepository(), await getMobRepository()), new MinuteTimer())
  gameServer.addObserver(new RegionWeather(
    locationService,
    stateService.weatherService,
    []), new MinuteTimer())
  gameServer.addObserver(new FightRounds(mobService), new SecondIntervalTimer())
  gameServer.addObserver(new Respawner(resetService), new FiveMinuteTimer())
  gameServer.addObserver(new DecrementPlayerDelay(), new SecondIntervalTimer())
  gameServer.addObserver(new HandleClientRequests(), new ShortIntervalTimer())

  return gameServer
}
