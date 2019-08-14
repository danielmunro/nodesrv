import {inject, injectable} from "inversify"
import {AffectType} from "../../affect/enum/affectType"
import AttributeBuilder from "../../attributes/builder/attributeBuilder"
import Event from "../../event/interface/event"
import EventService from "../../event/service/eventService"
import StateService from "../../gameService/stateService"
import {ItemEntity} from "../../item/entity/itemEntity"
import ItemService from "../../item/service/itemService"
import {MobEntity} from "../../mob/entity/mobEntity"
import {RaceType} from "../../mob/race/enum/raceType"
import LocationService from "../../mob/service/locationService"
import MobService from "../../mob/service/mobService"
import {SpellEntity as SpellModel} from "../../mob/spell/entity/spellEntity"
import {SpellType} from "../../mob/spell/spellType"
import {RegionEntity} from "../../region/entity/regionEntity"
import Request from "../../request/request"
import {RoomEntity} from "../../room/entity/roomEntity"
import match from "../../support/matcher/match"
import {getRandomIntFromRange, percentRoll} from "../../support/random/helpers"
import {Types} from "../../support/types"
import CheckBuilderFactory from "../factory/checkBuilderFactory"
import FoundItem from "./foundItem"

export const SKELETAL_WARRIOR_ID = 3
const DEFAULT_MANA = 100
const DEFAULT_MV = 100

@injectable()
export default class AbilityService {
  private static createSkeletalWarrior(caster: MobEntity, warrior: MobEntity) {
    const level = caster.level * 0.8
    const maxHp = level * 8 + getRandomIntFromRange(level * level / 8, level * level)
    warrior.level = level
    warrior.hp = maxHp
    warrior.mana = DEFAULT_MANA
    warrior.mv = DEFAULT_MV
    warrior.attributes.push(
      new AttributeBuilder()
        .setHitRoll(1, level / 2)
        .setVitals(maxHp, DEFAULT_MANA, DEFAULT_MV)
        .build())
    warrior.deathTimer = (level / 5) + 10
    warrior.follows = caster
    warrior.raceType = RaceType.Undead
    return warrior
  }
  constructor(
    @inject(Types.CheckBuilderFactory) private readonly checkBuilderFactory: CheckBuilderFactory,
    @inject(Types.EventService) private readonly eventService: EventService,
    @inject(Types.ItemService) private readonly itemService: ItemService,
    @inject(Types.StateService) private readonly stateService: StateService,
    @inject(Types.MobService) private readonly mobService: MobService,
    @inject(Types.LocationService) private readonly locationService: LocationService) {}

  public createCheckTemplate(request: Request) {
    return this.checkBuilderFactory.createCheckTemplate(request)
  }

  public publishEvent(event: Event) {
    return this.eventService.publish(event)
  }

  public async updateMobLocation(mob: MobEntity, room: RoomEntity = this.locationService.getRecall()) {
    await this.locationService.updateMobLocation(mob, room)
  }

  public getLocationForMob(mob: MobEntity) {
    return this.locationService.getLocationForMob(mob)
  }

  public getMobsByRoom(room: RoomEntity): MobEntity[] {
    return this.locationService.getMobsByRoom(room)
  }

  public findMob(nameSearch: string) {
    return this.mobService.findMob(m => match(m.name, nameSearch))
  }

  public async createSkeletalWarrior(mob: MobEntity, room: RoomEntity) {
    return this.mobService.add(
      AbilityService.createSkeletalWarrior(
        mob,
        await this.mobService.createMobFromId(SKELETAL_WARRIOR_ID) as MobEntity),
      room)
  }

  public findItems(mob: MobEntity, region: RegionEntity, searchTerm: string): FoundItem {
    let item: ItemEntity
    const mobs = this.itemService.itemTable.items
      .filter(i => {
        item = i
        return this.filterItem(
          mob,
          region,
          i,
          searchTerm,
          mob.spells.find(spell => spell.spellType === SpellType.LocateItem) as SpellModel)
      }).map(i => i.carriedBy)
    // @ts-ignore
    return { item, mobs }
  }

  private filterItem(
    mob: MobEntity,
    region: RegionEntity,
    item: ItemEntity,
    input: string,
    spell: SpellModel): boolean {
    return match(item.name, input) &&
      this.stateService.canMobSee(mob, region) &&
      mob.level >= item.level &&
      !item.affects.find(affect => affect.affectType === AffectType.NoLocate) &&
      percentRoll() < 2 * spell.level
  }
}
