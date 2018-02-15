import { Server } from "ws"
import { PORT } from "./../src/constants"
import { DiceRoller } from "./../src/dice/dice"
import { Player } from "./../src/player/player"
import { Room } from "./../src/room/room"
import { GameServer } from "./../src/server/index"
import { PersistPlayers } from "./../src/server/observers/persistPlayers"
import { Social } from "./../src/server/observers/social"
import { Tick } from "./../src/server/observers/tick"
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

const TICK_DICE_SIDES = 1000
const TICK_DICE_ROLLS = 20
const TICK_DICE_MODIFIER = 20000

gameServer.addObserver(
  new Tick(),
  new RandomTickTimer(
    new DiceRoller(TICK_DICE_SIDES, TICK_DICE_ROLLS, TICK_DICE_MODIFIER)))
gameServer.addObserver(new PersistPlayers(), new MinuteTimer())
gameServer.addObserver(new Social(), new ShortIntervalTimer())

gameServer.start()

console.log("server listening on port", PORT)
