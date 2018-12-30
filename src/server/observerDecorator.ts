import EventService from "../event/eventService"
import ResetService from "../gameService/resetService"
import {getPlayerRepository} from "../player/repository/player"
import { DiceRoller } from "../random/dice"
import { FiveMinuteTimer } from "../timer/fiveMinuteTimer"
import { MinuteTimer } from "../timer/minuteTimer"
import { RandomTickTimer } from "../timer/randomTickTimer"
import { SecondIntervalTimer } from "../timer/secondTimer"
import { tick } from "./constants"
import { DecrementAffects } from "./observers/decrementAffects"
import { FightRounds } from "./observers/fightRounds"
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
  eventService: EventService): Promise<GameServer> {
  const locationService = gameServer.mobService.locationService
  gameServer.addObserver(
    new ObserverChain([
      new Tick(gameServer.service.timeService, eventService, locationService),
      new DecrementAffects(gameServer.getMobTable()),
      new Wander(gameServer.getMobTable().getWanderingMobs(), locationService),
    ]),
    new RandomTickTimer(
      new DiceRoller(tick.dice.sides, tick.dice.rolls, tick.dice.modifier)))
  gameServer.addObserver(new PersistPlayers(await getPlayerRepository()), new MinuteTimer())
  gameServer.addObserver(new RegionWeather(locationService), new MinuteTimer())
  gameServer.addObserver(new FightRounds(gameServer.mobService), new SecondIntervalTimer())
  const respawner = new Respawner(resetService)
  gameServer.addObserver(respawner, new FiveMinuteTimer())

  return gameServer
}
