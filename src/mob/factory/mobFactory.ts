import {newEmptyAttributes} from "../../attributes/factory/attributeFactory"
import Attributes from "../../attributes/model/attributes"
import {createInventory} from "../../item/factory/inventoryFactory"
import {Item} from "../../item/model/item"
import {Room} from "../../room/model/room"
import {Disposition} from "../enum/disposition"
import DamageSource from "../model/damageSource"
import {Mob} from "../model/mob"
import MobLocation from "../model/mobLocation"
import MobReset from "../model/mobReset"
import {MobTraits} from "../model/mobTraits"
import OffensiveTraits from "../model/offensiveTraits"
import {PlayerMob} from "../model/playerMob"
import {RaceType} from "../race/enum/raceType"
import {SpecializationType} from "../specialization/enum/specializationType"

export function newMobReset(
  mob: Mob,
  room: Room,
  maxQuantity: number,
  maxPerRoom: number): MobReset {
  const mobReset = new MobReset()
  mobReset.mob = mob
  mobReset.room = room
  mobReset.disposition = Disposition.Standing
  mobReset.maxQuantity = maxQuantity
  mobReset.maxPerRoom = maxPerRoom

  return mobReset
}

export function newMobLocation(
  mob: Mob,
  room: Room): MobLocation {
  const mobLocation = new MobLocation()
  mobLocation.mob = mob
  mobLocation.room = room

  return mobLocation
}

/*tslint:disable*/
export function newMob(name: string, description: string, race: RaceType, hp: number, mana: number,
                       mv: number, attributes: Attributes, wanders: boolean = false, items: Item[] = [],
                       specialization = SpecializationType.Warrior): Mob {

  const mob = createMob()
  mob.name = name
  mob.description = description
  mob.raceType = race
  mob.hp = hp
  mob.mana = mana
  mob.mv = mv
  mob.attributes.push(attributes)
  mob.traits.wanders = wanders
  mob.specializationType = specialization
  items.forEach((item) => mob.inventory.addItem(item))

  return mob
}

export function createMob(): Mob {
  const mob = new Mob()
  mob.affects = []
  mob.immune = new DamageSource()
  mob.resist = new DamageSource()
  mob.vulnerable = new DamageSource()
  mob.traits = new MobTraits()
  mob.offensiveTraits = new OffensiveTraits()
  mob.hp = 0
  mob.mana = 0
  mob.mv = 0
  mob.attributes = []
  mob.inventory = createInventory()
  mob.equipped = createInventory()
  mob.skills = []
  mob.spells = []
  return mob
}

export function createPlayerMob(): PlayerMob {
  const playerMob = new PlayerMob()
  playerMob.trainedAttributes = newEmptyAttributes()
  return playerMob
}
