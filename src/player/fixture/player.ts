import { newAttributes, newHitroll, newStartingVitals } from "../../attributes/factory"
import Stats from "../../attributes/model/stats"
import { newShield, newWeapon } from "../../item/factory"
import { newMob, newSpell } from "../../mob/factory"
import { Race } from "../../mob/race/race"
import { Room } from "../../room/model/room"
import { newSkill } from "../../skill/factory"
import { SkillType } from "../../skill/skillType"
import { SpellType } from "../../spell/spellType"
import { newPlayer } from "../factory"
import { Player } from "../model/player"

export function getPlayerProvider(startRoom: Room) {
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
