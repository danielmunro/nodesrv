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

export default function addObservers(gameServer: GameServer): GameServer {
  const service = gameServer.service
  const mobTable = service.mobTable
  gameServer.addObserver(
    new ObserverChain([
      new Tick(),
      new DecrementAffects(mobTable),
      new Wander(service, mobTable.getWanderingMobs()),
    ]),
    new RandomTickTimer(
      new DiceRoller(tick.dice.sides, tick.dice.rolls, tick.dice.modifier)))
  const roomTable = service.roomTable
  gameServer.addObserver(new PersistPlayers(), new MinuteTimer())
  gameServer.addObserver(new RegionWeather(), new MinuteTimer())
  gameServer.addObserver(new SocialBroadcaster(), new ShortIntervalTimer())
  gameServer.addObserver(new FightRounds(), new SecondIntervalTimer())
  gameServer.addObserver(new Respawner(roomTable, mobTable, gameServer.resetService), new FiveMinuteTimer())

  return gameServer
}
