import { Server } from "ws"
import { PORT, TICK } from "./../src/constants"
import { DiceRoller } from "./../src/dice/dice"
import { Player } from "./../src/player/player"
import { Room } from "./../src/room/room"
import { PersistPlayers } from "./../src/server/observers/persistPlayers"
import { SocialBroadcaster } from "./../src/server/observers/socialBroadcaster"
import { Tick } from "./../src/server/observers/tick"
import { GameServer } from "./../src/server/server"
import { MinuteTimer } from "./../src/server/timer/minuteTimer"
import { RandomTickTimer } from "./../src/server/timer/randomTickTimer"
import { ShortIntervalTimer } from "./../src/server/timer/shortIntervalTimer"

const startRoom = new Room("default name", "boo", "boo", [])

function playerProvider(name: string): Player {
  return new Player(name, startRoom)
}

const gameServer = new GameServer(
  new Server({ port: PORT }),
  playerProvider,
)
gameServer.addObserver(
  new Tick(),
  new RandomTickTimer(
    new DiceRoller(TICK.DICE.SIDES, TICK.DICE.ROLLS, TICK.DICE.MODIFIER)))
gameServer.addObserver(new PersistPlayers(), new MinuteTimer())
gameServer.addObserver(new SocialBroadcaster(), new ShortIntervalTimer())
gameServer.start()

console.log("server listening on port", PORT)
