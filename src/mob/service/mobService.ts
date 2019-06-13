import {inject, injectable} from "inversify"
import {cloneDeep} from "lodash"
import KafkaService from "../../kafka/kafkaService"
import LevelService from "../../player/service/levelService"
import { RoomEntity } from "../../room/entity/roomEntity"
import {Direction} from "../../room/enum/direction"
import { newSkill } from "../../skill/factory"
import { Skill } from "../../skill/model/skill"
import { SkillType } from "../../skill/skillType"
import { Spell } from "../../spell/model/spell"
import { SpellType } from "../../spell/spellType"
import {Types} from "../../support/types"
import { newMobLocation } from "../factory/mobFactory"
import { Fight } from "../fight/fight"
import FightTable from "../fight/fightTable"
import { Mob } from "../model/mob"
import MobLocation from "../model/mobLocation"
import MobReset from "../model/mobReset"
import { Specialization } from "../specialization/specialization"
import MobTable from "../table/mobTable"
import LocationService from "./locationService"

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
  mob.specializationType = specialization.getSpecializationType()
  mob.attributes.push(specialization.getAttributes())
  mob.skills = [...mob.skills, ...specialization.getSkills().map(createSkillFromSkillType)]
  mob.spells = [...mob.spells, ...specialization.getSpells().map(createSpellFromSpellType)]
}

@injectable()
export default class MobService {
  constructor(
    @inject(Types.MobTable) public readonly mobTemplateTable: MobTable,
    @inject(Types.LocationService) private readonly locationService: LocationService,
    @inject(Types.KafkaService) private readonly kafkaService: KafkaService,
    public readonly mobTable: MobTable = new MobTable(),
    private readonly fightTable: FightTable = new FightTable()) {}

  public add(mob: Mob, room: RoomEntity) {
    this.mobTable.add(mob)
    this.locationService.addMobLocation(newMobLocation(mob, room))
  }

  public getFightCount(): number {
    return this.fightTable.getFights().length
  }

  public addFight(fight: Fight) {
    this.fightTable.addFight(fight)
  }

  public findFight(search: (fight: Fight) => boolean) {
    return this.fightTable.getFights().find(search)
  }

  public findFightForMob(mob: Mob): Fight | undefined {
    return this.fightTable.getFights().find(fight => fight.isParticipant(mob))
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

  public getMobsByImportId(importId: string) {
    return this.locationService.getMobsByImportId(importId)
  }

  public getMobsByRoom(room: RoomEntity): Mob[] {
    return this.locationService.getMobsByRoom(room)
  }

  public getLocationForMob(mob: Mob): MobLocation {
    return this.locationService.getLocationForMob(mob)
  }

  public async moveMob(mob: Mob, direction: Direction) {
    await this.locationService.moveMob(mob, direction)
  }

  public async updateMobLocation(mob: Mob, room: RoomEntity, direction?: Direction) {
    await this.locationService.updateMobLocation(mob, room, direction)
  }

  public findMob(search: (mob: Mob) => boolean) {
    return this.mobTable.find(search)
  }

  public findMobsByArea(area: string): MobLocation[] {
    return this.locationService.findMobsByArea(area)
  }

  public findMobInRoomWithMob(mob: Mob, searchCriteria: (mob: Mob) => boolean) {
    const mobs = this.locationService.getMobsInRoomWithMob(mob)
    return mobs.find(searchCriteria)
  }

  public async createMobFromReset(mobReset: MobReset): Promise<Mob> {
    return cloneDeep(mobReset.mob)
  }

  public async createMobFromId(id: number) {
    const mob = this.mobTemplateTable.find((m: Mob) => m.id === id)
    return cloneDeep(mob)
  }

  public createLevelServiceForMob(mob: Mob): LevelService {
    return new LevelService(this.kafkaService, mob)
  }
}
