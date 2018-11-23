import { DiceRoller } from "../random/dice"
import { FiveMinuteTimer } from "../timer/fiveMinuteTimer"
import { MinuteTimer } from "../timer/minuteTimer"
import { RandomTickTimer } from "../timer/randomTickTimer"
import { SecondIntervalTimer } from "../timer/secondTimer"
import { ShortIntervalTimer } from "../timer/shortIntervalTimer"
import { tick } from "./constants"
import { DecrementAffects } from "./observers/decrementAffects"
import { FightRounds } from "./observers/fightRounds"
import { ObserverChain } from "./observers/observerChain"
import { PersistPlayers } from "./observers/persistPlayers"
import { RegionWeather } from "./observers/regionWeather"
import Respawner from "./observers/respawner"
import { SocialBroadcaster } from "./observers/socialBroadcaster"
import { Tick } from "./observers/tick"
import { Wander } from "./observers/wander"
import { GameServer } from "./server"

export default async function addObservers(gameServer: GameServer): Promise<GameServer> {
  const roomTable = gameServer.service.roomTable
  const locationService = gameServer.mobService.locationService
  gameServer.addObserver(
    new ObserverChain([
      new Tick(gameServer.service, locationService),
      new DecrementAffects(gameServer.getMobTable()),
      new Wander(gameServer.getMobTable().getWanderingMobs(), locationService),
    ]),
    new RandomTickTimer(
      new DiceRoller(tick.dice.sides, tick.dice.rolls, tick.dice.modifier)))
  const resetService = gameServer.resetService
  gameServer.addObserver(new PersistPlayers(), new MinuteTimer())
  gameServer.addObserver(new RegionWeather(locationService), new MinuteTimer())
  gameServer.addObserver(new SocialBroadcaster(locationService), new ShortIntervalTimer())
  gameServer.addObserver(new FightRounds(locationService), new SecondIntervalTimer())
  const respawner = new Respawner(gameServer.mobService, roomTable, resetService)
  await respawner.seedMobTable()
  gameServer.addObserver(respawner, new FiveMinuteTimer())
  await respawner.notify([])

  return gameServer
}
