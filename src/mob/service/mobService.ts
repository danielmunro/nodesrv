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
import { MobEntity } from "../entity/mobEntity"
import MobLocationEntity from "../entity/mobLocationEntity"
import MobResetEntity from "../entity/mobResetEntity"
import { newMobLocation } from "../factory/mobFactory"
import { Fight } from "../fight/fight"
import FightTable from "../fight/fightTable"
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

export function assignSpecializationToMob(mob: MobEntity, specialization: Specialization) {
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

  public add(mob: MobEntity, room: RoomEntity) {
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

  public findFightForMob(mob: MobEntity): Fight | undefined {
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

  public getMobsByRoom(room: RoomEntity): MobEntity[] {
    return this.locationService.getMobsByRoom(room)
  }

  public getLocationForMob(mob: MobEntity): MobLocationEntity {
    return this.locationService.getLocationForMob(mob)
  }

  public async moveMob(mob: MobEntity, direction: Direction) {
    await this.locationService.moveMob(mob, direction)
  }

  public async updateMobLocation(mob: MobEntity, room: RoomEntity, direction?: Direction) {
    await this.locationService.updateMobLocation(mob, room, direction)
  }

  public findMob(search: (mob: MobEntity) => boolean) {
    return this.mobTable.find(search)
  }

  public findMobsByArea(area: string): MobLocationEntity[] {
    return this.locationService.findMobsByArea(area)
  }

  public findMobInRoomWithMob(mob: MobEntity, searchCriteria: (mob: MobEntity) => boolean) {
    const mobs = this.locationService.getMobsInRoomWithMob(mob)
    return mobs.find(searchCriteria)
  }

  public async createMobFromReset(mobReset: MobResetEntity): Promise<MobEntity> {
    return cloneDeep(mobReset.mob)
  }

  public async createMobFromId(id: number) {
    const mob = this.mobTemplateTable.find((m: MobEntity) => m.id === id)
    return cloneDeep(mob)
  }

  public createLevelServiceForMob(mob: MobEntity): LevelService {
    return new LevelService(this.kafkaService, mob)
  }
}
