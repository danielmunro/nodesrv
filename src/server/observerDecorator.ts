import EventService from "../event/eventService"
import GameService from "../gameService/gameService"
import ResetService from "../gameService/resetService"
import MobService from "../mob/mobService"
import {getMobRepository} from "../mob/repository/mob"
import {getPlayerRepository} from "../player/repository/player"
import { DiceRoller } from "../random/dice"
import { FiveMinuteTimer } from "../timer/fiveMinuteTimer"
import { MinuteTimer } from "../timer/minuteTimer"
import { RandomTickTimer } from "../timer/randomTickTimer"
import { SecondIntervalTimer } from "../timer/secondTimer"
import {ShortIntervalTimer} from "../timer/shortIntervalTimer"
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
  gameService: GameService,
  gameServer: GameServer,
  resetService: ResetService,
  eventService: EventService,
  mobService: MobService): Promise<GameServer> {
  const locationService = mobService.locationService
  gameServer.addObserver(
    new ObserverChain([
      new Tick(gameService.timeService, eventService, locationService),
      new DecrementAffects(mobService.mobTable),
      new Wander(mobService.mobTable.getWanderingMobs(), locationService),
    ]),
    new RandomTickTimer(
      new DiceRoller(tick.dice.sides, tick.dice.rolls, tick.dice.modifier)))
  gameServer.addObserver(new PersistPlayers(
    await getPlayerRepository(), await getMobRepository()), new MinuteTimer())
  gameServer.addObserver(new RegionWeather(
    locationService,
    gameService.weatherService,
    []), new MinuteTimer())
  gameServer.addObserver(new FightRounds(mobService), new SecondIntervalTimer())
  gameServer.addObserver(new Respawner(resetService), new FiveMinuteTimer())
  gameServer.addObserver(new DecrementPlayerDelay(), new SecondIntervalTimer())
  gameServer.addObserver(new HandleClientRequests(), new ShortIntervalTimer())

  return gameServer
}
