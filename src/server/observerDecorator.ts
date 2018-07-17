import { DiceRoller } from "../dice/dice"
import { findWanderingMobs } from "../mob/repository/mob"
import { MinuteTimer } from "../timer/minuteTimer"
import { RandomTickTimer } from "../timer/randomTickTimer"
import { SecondIntervalTimer } from "../timer/secondTimer"
import { ShortIntervalTimer } from "../timer/shortIntervalTimer"
import { DecrementAffects } from "./observers/decrementAffects"
import { FightRounds } from "./observers/fightRounds"
import { ObserverChain } from "./observers/observerChain"
import { PersistPlayers } from "./observers/persistPlayers"
import { SocialBroadcaster } from "./observers/socialBroadcaster"
import { Tick } from "./observers/tick"
import { Wander } from "./observers/wander"
import { GameServer } from "./server"

export const TICK = {
  DICE: {
    MODIFIER: 20000,
    ROLLS: 20,
    SIDES: 1000,
  },
}

export default function addObservers(gameServer: GameServer): GameServer {
  gameServer.addObserver(
    new ObserverChain([
      new Tick(),
      new DecrementAffects(),
      new Wander(() => findWanderingMobs()),
    ]),
    new RandomTickTimer(
      new DiceRoller(TICK.DICE.SIDES, TICK.DICE.ROLLS, TICK.DICE.MODIFIER)))
  gameServer.addObserver(new PersistPlayers(), new MinuteTimer())
  gameServer.addObserver(new SocialBroadcaster(), new ShortIntervalTimer())
  gameServer.addObserver(new FightRounds(), new SecondIntervalTimer())

  return gameServer
}
