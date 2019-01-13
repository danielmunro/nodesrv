import {cloneDeep} from "lodash"
import { Room } from "../room/model/room"
import { newSkill } from "../skill/factory"
import { Skill } from "../skill/model/skill"
import { SkillType } from "../skill/skillType"
import { Spell } from "../spell/model/spell"
import { SpellType } from "../spell/spellType"
import { newMobLocation } from "./factory"
import { Fight } from "./fight/fight"
import FightTable from "./fight/fightTable"
import LocationService from "./locationService"
import MobTable from "./mobTable"
import { Mob } from "./model/mob"
import MobReset from "./model/mobReset"
import { Specialization } from "./specialization/specialization"

function createSkillFromSkillType(skillType: SkillType): Skill {
  return newSkill(skillType, 1)
}

function createSpellFromSpellType(spellType: SpellType): Spell {
  const spell = new Spell()
  spell.spellType = spellType
  spell.level = 1
  return spell
}

export function assignSpecializationToMob(mob: Mob, specialization: Specialization) {
  mob.specialization = specialization.getSpecializationType()
  mob.attributes.push(specialization.getAttributes())
  mob.skills = [...mob.skills, ...specialization.getSkills().map(createSkillFromSkillType)]
  mob.spells = [...mob.spells, ...specialization.getSpells().map(createSpellFromSpellType)]
}

export default class MobService {
  constructor(
    public readonly mobTable: MobTable = new MobTable(),
    public readonly mobTemplateTable: MobTable = new MobTable(),
    private readonly fightTable: FightTable = new FightTable(),
    public readonly locationService: LocationService = new LocationService()) {}

  public add(mob: Mob, room: Room) {
    this.mobTable.add(mob)
    this.locationService.addMobLocation(newMobLocation(mob, room))
  }

  public addFight(fight: Fight) {
    this.fightTable.addFight(fight)
  }

  public findFight(search) {
    return this.fightTable.getFights().find(search)
  }

  public filterCompleteFights() {
    this.fightTable.filterCompleteFights()
  }

  public async doFightRounds() {
    return await Promise.all(this.fightTable.getFights().map(async fight => await fight.round()))
  }

  public pruneDeadMobs() {
    const deadMobs = this.mobTable.pruneDeadMobs()
    deadMobs.forEach(mob => this.locationService.removeMob(mob))

    return deadMobs
  }

  public findMobInRoomWithMob(mob: Mob, searchCriteria) {
    const mobs = this.locationService.getMobsInRoomWithMob(mob)
    return mobs.find(searchCriteria)
  }

  public async generateNewMobInstance(mobReset: MobReset): Promise<Mob> {
    const mob = this.mobTemplateTable.find(m => m.id === mobReset.mob.id)
    const clone = cloneDeep(mob)
    clone.mobReset = mobReset

    return clone
  }
}
