import * as assert from "assert"
import { Server } from "ws"
import { PORT, TICK } from "../src/constants"
import { DiceRoller } from "../src/dice/dice"
import { findWanderingMobs } from "../src/mob/repository/mob"
import { getPlayerProvider } from "../src/player/fixture/player"
import { findOneRoom } from "../src/room/repository/room"
import { DecrementAffects } from "../src/server/observers/decrementAffects"
import { FightRounds } from "../src/server/observers/fightRounds"
import { ObserverChain } from "../src/server/observers/observerChain"
import { PersistPlayers } from "../src/server/observers/persistPlayers"
import { SocialBroadcaster } from "../src/server/observers/socialBroadcaster"
import { Tick } from "../src/server/observers/tick"
import { Wander } from "../src/server/observers/wander"
import { GameServer } from "../src/server/server"
import { MinuteTimer } from "../src/timer/minuteTimer"
import { RandomTickTimer } from "../src/timer/randomTickTimer"
import { SecondIntervalTimer } from "../src/timer/secondTimer"
import { ShortIntervalTimer } from "../src/timer/shortIntervalTimer"

function addObservers(gameServer: GameServer): GameServer {
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

const startRoomID = +process.argv[2]
assert.ok(startRoomID > 0, "start room ID is required to be a number")
console.log("starting up", { port: PORT, startRoomID })

findOneRoom(startRoomID).then((startRoom) =>
  addObservers(
    new GameServer(
      new Server({ port: PORT }),
      getPlayerProvider(startRoom))).start())
