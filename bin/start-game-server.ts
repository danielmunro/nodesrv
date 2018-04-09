import { Server } from "ws"
import { newAttributes, newHitroll, newStartingVitals } from "./../src/attributes/factory"
import Stats from "./../src/attributes/model/stats"
import { PORT, TICK } from "./../src/constants"
import { DiceRoller } from "./../src/dice/dice"
import { newShield, newWeapon } from "./../src/item/factory"
import { newMob } from "./../src/mob/factory"
import { Race } from "./../src/mob/race/race"
import { addMob } from "./../src/mob/table"
import { newPlayer } from "./../src/player/factory"
import { Player } from "./../src/player/model/player"
import { Room } from "./../src/room/model/room"
import { findOneRoom } from "./../src/room/repository/room"
import { DecrementAffects } from "./../src/server/observers/decrementAffects"
import { FightRounds } from "./../src/server/observers/fightRounds"
import { ObserverChain } from "./../src/server/observers/observerChain"
import { PersistPlayers } from "./../src/server/observers/persistPlayers"
import { SocialBroadcaster } from "./../src/server/observers/socialBroadcaster"
import { Tick } from "./../src/server/observers/tick"
import { GameServer } from "./../src/server/server"
import { Skill } from "./../src/skill/model/skill"
import { SkillType } from "./../src/skill/skillType"
import { Spell } from "./../src/spell/model/spell"
import { SpellType } from "./../src/spell/spellType"
import { MinuteTimer } from "./../src/timer/minuteTimer"
import { RandomTickTimer } from "./../src/timer/randomTickTimer"
import { SecondIntervalTimer } from "./../src/timer/secondTimer"
import { ShortIntervalTimer } from "./../src/timer/shortIntervalTimer"

const startRoomID = +process.argv[2]

function addObservers(gameServer: GameServer): GameServer {
  gameServer.addObserver(
    new ObserverChain([
      new Tick(),
      new DecrementAffects(),
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
      [
        newWeapon(
          "a wooden practice sword",
          "A small wooden practice sword has been left here."),
        newShield(
          "a cracked wooden practice shield",
          "A wooden practice shield has been carelessly left here.")])

    const skill = new Skill()
    skill.skillType = SkillType.Bash
    mob.skills.push(skill)

    const mm = new Spell()
    mm.spellType = SpellType.MagicMissile
    mob.spells.push(mm)

    const shield = new Spell()
    shield.spellType = SpellType.Shield
    mob.spells.push(shield)

    startRoom.addMob(mob)
    addMob(mob)

    return newPlayer("Test Testerson", mob)
  }
}

console.log("starting up", { port: PORT, startRoomID })

findOneRoom(startRoomID).then((startRoom) =>
  addObservers(
    new GameServer(
      new Server({ port: PORT }),
      getPlayerProvider(startRoom))).start())
