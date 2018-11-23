import { Room } from "../room/model/room"
import { newSkill } from "../skill/factory"
import { Skill } from "../skill/model/skill"
import { SkillType } from "../skill/skillType"
import { newSpell } from "../spell/factory"
import { Spell } from "../spell/model/spell"
import { SpellType } from "../spell/spellType"
import { MESSAGE_MOB_ALREADY_HAS_SPECIALIZATION } from "./constants"
import { newMobLocation } from "./factory"
import FightTable from "./fight/fightTable"
import LocationService from "./locationService"
import MobTable from "./mobTable"
import { Mob } from "./model/mob"
import MobReset from "./model/mobReset"
import MobRepository from "./repository/mob"
import { Specialization } from "./specialization/specialization"

function createSkillFromSkillType(skillType: SkillType): Skill {
  return newSkill(skillType, 1)
}

function createSpellFromSpellType(spellType: SpellType): Spell {
  return newSpell(spellType, 1)
}

export function assignSpecializationToMob(mob: Mob, specialization: Specialization) {
  if (mob.specialization !== undefined) {
    throw Error(MESSAGE_MOB_ALREADY_HAS_SPECIALIZATION)
  }

  mob.specialization = specialization.getSpecializationType()
  mob.attributes.push(specialization.getAttributes())
  mob.skills = [...mob.skills, ...specialization.getSkills().map(createSkillFromSkillType)]
  mob.spells = [...mob.spells, ...specialization.getSpells().map(createSpellFromSpellType)]
}

export default class MobService {
  /*tslint:disable*/
  constructor(
    public readonly mobTable: MobTable,
    private readonly mobRepository: MobRepository,
    private readonly fightTable: FightTable = new FightTable(),
    public readonly locationService: LocationService = new LocationService()) {}

  public add(mob: Mob, room: Room) {
    this.mobTable.add(mob)
    this.locationService.addMobLocation(newMobLocation(mob, room))
  }

  public pruneDeadMobs() {
    const deadMobs = this.mobTable.pruneDeadMobs()
    deadMobs.forEach(mob => this.locationService.removeMob(mob))

    return deadMobs
  }

  public async generateNewMobInstance(mobReset: MobReset) {
    const mob = await this.mobRepository.findOneById(mobReset.mob.id)
    const clone = mob.copy()
    clone.mobReset = mobReset

    return clone
  }
}
