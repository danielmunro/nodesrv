import {Mob} from "../mob/model/mob"
import RaceService from "../mob/race/raceService"
import {newEmptyAttributes} from "./factory"
import Attributes from "./model/attributes"
import Stats from "./model/stats"
import Vitals from "./model/vitals"

export default class AttributeService {
  constructor(private readonly mob: Mob) {}

  public getStats(): Stats {
    return this.combine().stats
  }

  public getVitals(): Vitals {
    return this.combine().vitals
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
    return this.mob.vitals.hp
  }

  public getMaxHp(): number {
    return this.combine().vitals.hp
  }

  public getMv(): number {
    return this.mob.vitals.mv
  }

  public getMaxMv(): number {
    return this.combine().vitals.mv
  }

  public addMv(mv: number) {
    this.mob.vitals.mv += mv
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
    if (this.mob.vitals.hp > combined.vitals.hp) {
      this.mob.vitals.hp = combined.vitals.hp
    }
    if (this.mob.vitals.mana > combined.vitals.mana) {
      this.mob.vitals.mana = combined.vitals.mana
    }
    if (this.mob.vitals.mv > combined.vitals.mv) {
      this.mob.vitals.mv = combined.vitals.mv
    }
  }
}
