import AttributesEntity from "../../attributes/entity/attributesEntity"
import {newEmptyAttributes} from "../../attributes/factory/attributeFactory"
import {ItemEntity} from "../../item/entity/itemEntity"
import {createInventory} from "../../item/factory/inventoryFactory"
import {RoomEntity} from "../../room/entity/roomEntity"
import DamageSourceEntity from "../entity/damageSourceEntity"
import {MobEntity} from "../entity/mobEntity"
import MobLocationEntity from "../entity/mobLocationEntity"
import MobResetEntity from "../entity/mobResetEntity"
import {MobTraitsEntity} from "../entity/mobTraitsEntity"
import OffensiveTraitsEntity from "../entity/offensiveTraitsEntity"
import {PlayerMobEntity} from "../entity/playerMobEntity"
import {Disposition} from "../enum/disposition"
import {RaceType} from "../race/enum/raceType"
import {SpecializationType} from "../specialization/enum/specializationType"

export function newMobReset(
  mob: MobEntity,
  room: RoomEntity,
  maxQuantity: number,
  maxPerRoom: number): MobResetEntity {
  const mobReset = new MobResetEntity()
  mobReset.mob = mob
  mobReset.room = room
  mobReset.disposition = Disposition.Standing
  mobReset.maxQuantity = maxQuantity
  mobReset.maxPerRoom = maxPerRoom

  return mobReset
}

export function newMobLocation(
  mob: MobEntity,
  room: RoomEntity): MobLocationEntity {
  const mobLocation = new MobLocationEntity()
  mobLocation.mob = mob
  mobLocation.room = room

  return mobLocation
}

/*tslint:disable*/
export function newMob(name: string, description: string, race: RaceType, hp: number, mana: number,
                       mv: number, attributes: AttributesEntity, wanders: boolean = false, items: ItemEntity[] = [],
                       specialization = SpecializationType.Warrior): MobEntity {

  const mob = createMob()
  mob.name = name
  mob.description = description
  mob.raceType = race
  mob.gold = 0
  mob.hp = hp
  mob.mana = mana
  mob.mv = mv
  mob.attributes.push(attributes)
  mob.traits.wanders = wanders
  mob.specializationType = specialization
  items.forEach((item) => mob.inventory.addItem(item))

  return mob
}

export function createMob(): MobEntity {
  const mob = new MobEntity()
  mob.affects = []
  mob.immune = new DamageSourceEntity()
  mob.resist = new DamageSourceEntity()
  mob.vulnerable = new DamageSourceEntity()
  mob.traits = new MobTraitsEntity()
  mob.offensiveTraits = new OffensiveTraitsEntity()
  mob.hp = 0
  mob.mana = 0
  mob.mv = 0
  mob.attributes = []
  mob.inventory = createInventory()
  mob.equipped = createInventory()
  mob.skills = []
  mob.spells = []
  mob.allowFollow = true
  return mob
}

export function createPlayerMob(): PlayerMobEntity {
  const playerMob = new PlayerMobEntity()
  playerMob.trainedAttributes = newEmptyAttributes()
  playerMob.aliases = []
  playerMob.autoAssist = true
  playerMob.autoExit = true
  playerMob.autoList = true
  playerMob.autoLoot = true
  playerMob.autoSac = true
  playerMob.autoSplit = true
  return playerMob
}
