import * as isUUID from "is-uuid"
import { Server } from "ws"
import { Attributes } from "./../src/attributes/attributes"
import { PORT, TICK } from "./../src/constants"
import { DiceRoller } from "./../src/dice/dice"
import { Domain } from "./../src/domain"
import { Mob } from "./../src/mob/mob"
import { Race } from "./../src/mob/race/race"
import { Player } from "./../src/player/player"
import { findRoom } from "./../src/room/repository"
import { Room } from "./../src/room/room"
import { PersistMobs } from "./../src/server/observers/persistMobs"
import { PersistPlayers } from "./../src/server/observers/persistPlayers"
import { SocialBroadcaster } from "./../src/server/observers/socialBroadcaster"
import { Tick } from "./../src/server/observers/tick"
import { GameServer } from "./../src/server/server"
import { MinuteTimer } from "./../src/server/timer/minuteTimer"
import { RandomTickTimer } from "./../src/server/timer/randomTickTimer"
import { ShortIntervalTimer } from "./../src/server/timer/shortIntervalTimer"

const startRoomID = process.argv[2]

if (!isUUID.v4(startRoomID)) {
  console.log("need a valid room ID to start with")
  process.exit(1)
}

function addObservers(gameServer: GameServer): GameServer {
  gameServer.addObserver(
    new Tick(),
    new RandomTickTimer(
      new DiceRoller(TICK.DICE.SIDES, TICK.DICE.ROLLS, TICK.DICE.MODIFIER)))
  gameServer.addObserver(new PersistPlayers(), new MinuteTimer())
  gameServer.addObserver(new PersistMobs(), new MinuteTimer())
  gameServer.addObserver(new SocialBroadcaster(), new ShortIntervalTimer())

  return gameServer
}

function getPlayerProvider(startRoom: Room) {
  return (name: string): Player => {
    const player = new Player(name)
    player.setMob(new Mob("pat", Race.Human, 1, 0, 0, Attributes.withNoAttributes(), startRoom))

    return player
  }
}

console.log("starting up", { port: PORT, startRoomID })

findRoom(startRoomID)
  .then((startRoom) =>
    addObservers(
      new GameServer(
        new Server({ port: PORT }),
        getPlayerProvider(startRoom))).start())
  .catch(() => console.log("start up failed"))
