import { Server } from "ws"
import { PORT, TICK } from "./../src/constants"
import { DiceRoller } from "./../src/dice/dice"
import { Domain } from "./../src/domain"
import { Player } from "./../src/player/player"
import { findRoom } from "./../src/room/repository"
import { Room } from "./../src/room/room"
import { PersistPlayers } from "./../src/server/observers/persistPlayers"
import { SocialBroadcaster } from "./../src/server/observers/socialBroadcaster"
import { Tick } from "./../src/server/observers/tick"
import { GameServer } from "./../src/server/server"
import { MinuteTimer } from "./../src/server/timer/minuteTimer"
import { RandomTickTimer } from "./../src/server/timer/randomTickTimer"
import { ShortIntervalTimer } from "./../src/server/timer/shortIntervalTimer"

const startRoomName = process.argv[2]

findRoom(process.argv[2]).then((startRoom) => {
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

  console.log("server listening", { port: PORT, startRoomName })
}).catch(() => console.log("failed to start server, start room not found"))
