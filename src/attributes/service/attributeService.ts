import {Mob} from "../../mob/model/mob"
import RaceService from "../../mob/race/raceService"
import {newEmptyAttributes} from "../factory/attributeFactory"
import Attributes from "../model/attributes"
import Stats from "../model/stats"

export default class AttributeService {
  constructor(private readonly mob: Mob) {}

  public getStats(): Stats {
    return this.combine().stats
  }

  public combine(): Attributes {
    let attributes = newEmptyAttributes()
    this.mob.attributes.forEach(a => attributes = attributes.combine(a))
    this.mob.equipped.items.forEach(i => attributes = attributes.combine(i.attributes))
    attributes = RaceService.combineAttributes(this.mob, attributes)
    if (this.mob.playerMob) {
      attributes = attributes.combine(this.mob.playerMob.trainedAttributes)
    }
    this.mob.affects.filter(affect => affect.attributes)
      .forEach(affect => attributes = attributes.combine(affect.attributes))

    return attributes
  }

  public getHp(): number {
    return this.mob.hp
  }

  public getMaxHp(): number {
    return this.combine().hp
  }

  public getMv(): number {
    return this.mob.mv
  }

  public getMaxMv(): number {
    return this.combine().mv
  }

  public addMv(mv: number) {
    this.mob.mv += mv
    this.normalize()
  }

  public getInt(): number {
    return this.combine().stats.int
  }

  public getWis(): number {
    return this.combine().stats.wis
  }

  public getDex(): number {
    return this.combine().stats.dex
  }

  public normalize(): void {
    const combined = this.combine()
    if (this.mob.hp > combined.hp) {
      this.mob.hp = combined.hp
    }
    if (this.mob.mana > combined.mana) {
      this.mob.mana = combined.mana
    }
    if (this.mob.mv > combined.mv) {
      this.mob.mv = combined.mv
    }
  }
}
