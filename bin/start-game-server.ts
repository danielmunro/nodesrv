import { Server } from "ws"
import { newAttributes, newHitroll, newStartingVitals } from "./../src/attributes/factory"
import Stats from "./../src/attributes/model/stats"
import { PORT, TICK } from "./../src/constants"
import { DiceRoller } from "./../src/dice/dice"
import { newShield, newWeapon } from "./../src/item/factory"
import { newMob } from "./../src/mob/factory"
import { Race } from "./../src/mob/race/race"
import { newPlayer } from "./../src/player/factory"
import { Player } from "./../src/player/model/player"
import { Room } from "./../src/room/model/room"
import { findOneRoom } from "./../src/room/repository/room"
import { FightRounds } from "./../src/server/observers/fightRounds"
import { PersistMobs } from "./../src/server/observers/persistMobs"
import { PersistPlayers } from "./../src/server/observers/persistPlayers"
import { SocialBroadcaster } from "./../src/server/observers/socialBroadcaster"
import { Tick } from "./../src/server/observers/tick"
import { GameServer } from "./../src/server/server"
import { MinuteTimer } from "./../src/server/timer/minuteTimer"
import { RandomTickTimer } from "./../src/server/timer/randomTickTimer"
import { SecondIntervalTimer } from "./../src/server/timer/secondTimer"
import { ShortIntervalTimer } from "./../src/server/timer/shortIntervalTimer"

const startRoomID = +process.argv[2]

function addObservers(gameServer: GameServer): GameServer {
  gameServer.addObserver(
    new Tick(),
    new RandomTickTimer(
      new DiceRoller(TICK.DICE.SIDES, TICK.DICE.ROLLS, TICK.DICE.MODIFIER)))
  gameServer.addObserver(new PersistPlayers(), new MinuteTimer())
  gameServer.addObserver(new PersistMobs(), new MinuteTimer())
  gameServer.addObserver(new SocialBroadcaster(), new ShortIntervalTimer())
  gameServer.addObserver(new FightRounds(), new SecondIntervalTimer())

  return gameServer
}

function getPlayerProvider(startRoom: Room) {
  return (name: string): Player => {
    const vitals = newStartingVitals()
    const attributes = newAttributes(
      newStartingVitals(),
      new Stats(),
      newHitroll(1, 1))
    const mob = newMob(
      "a test mob",
      "A description for this test mob.",
      Race.Human,
      vitals,
      attributes,
      [
        newWeapon(
          "a wooden practice sword",
          "A small wooden practice sword has been left here."),
        newShield(
          "a cracked wooden practice shield",
          "A wooden practice shield has been carelessly left here.")])
    startRoom.addMob(mob)

    return newPlayer("Test Testerson", mob)
  }
}

console.log("starting up", { port: PORT, startRoomID })

findOneRoom(startRoomID).then((startRoom) =>
  addObservers(
    new GameServer(
      new Server({ port: PORT }),
      getPlayerProvider(startRoom))).start())
