import { Server } from "ws"
import { newAttributes, newHitroll, newStartingVitals } from "../src/attributes/factory"
import Stats from "../src/attributes/model/stats"
import { PORT, TICK } from "../src/constants"
import { DiceRoller } from "../src/dice/dice"
import { newShield, newWeapon } from "../src/item/factory"
import { newMob } from "../src/mob/factory"
import { Race } from "../src/mob/race/race"
import { findWanderingMobs } from "../src/mob/repository/mob"
import { newPlayer } from "../src/player/factory"
import { Player } from "../src/player/model/player"
import { Room } from "../src/room/model/room"
import { findOneRoom } from "../src/room/repository/room"
import { DecrementAffects } from "../src/server/observers/decrementAffects"
import { FightRounds } from "../src/server/observers/fightRounds"
import { ObserverChain } from "../src/server/observers/observerChain"
import { PersistPlayers } from "../src/server/observers/persistPlayers"
import { SocialBroadcaster } from "../src/server/observers/socialBroadcaster"
import { Tick } from "../src/server/observers/tick"
import { Wander } from "../src/server/observers/wander"
import { GameServer } from "../src/server/server"
import { newSkill } from "../src/skill/factory"
import { SkillType } from "../src/skill/skillType"
import { newSpell } from "../src/spell/factory"
import { SpellType } from "../src/spell/spellType"
import { MinuteTimer } from "../src/timer/minuteTimer"
import { RandomTickTimer } from "../src/timer/randomTickTimer"
import { SecondIntervalTimer } from "../src/timer/secondTimer"
import { ShortIntervalTimer } from "../src/timer/shortIntervalTimer"

const startRoomID = +process.argv[2]

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
      false,
      [
        newWeapon(
          "a wooden practice sword",
          "A small wooden practice sword has been left here."),
        newShield(
          "a cracked wooden practice shield",
          "A wooden practice shield has been carelessly left here.")])

    mob.skills.push(newSkill(SkillType.Bash))
    mob.spells.push(newSpell(SpellType.MagicMissile))
    mob.spells.push(newSpell(SpellType.Shield))
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
