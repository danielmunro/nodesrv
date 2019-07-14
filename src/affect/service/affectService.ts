import {ItemEntity} from "../../item/entity/itemEntity"
import {MobEntity} from "../../mob/entity/mobEntity"
import {Trigger} from "../../mob/enum/trigger"
import Maybe from "../../support/functional/maybe/maybe"
import {AffectEntity} from "../entity/affectEntity"
import {AffectType} from "../enum/affectType"
import {modifierTable} from "../table/modifierTable"

export default class AffectService {
  public static applyAffectModifier(affects: AffectType[], trigger: Trigger, value: number): number {
    modifierTable
      .filter(m => m.trigger === trigger && affects.indexOf(m.affectType) > -1)
      .forEach(m => {
        value = m.modifier(value)
      })

    return value
  }

  constructor(private readonly mob: MobEntity | ItemEntity) {}

  public canDetectInvisible(): boolean {
    return this.has(AffectType.DetectInvisible)
  }

  public isInvisible(): boolean {
    return this.has(AffectType.Invisible)
  }

  public isPoisoned(): boolean {
    return this.has(AffectType.Poison)
  }

  public isBlind(): boolean {
    return this.has(AffectType.Blind)
  }

  public has(affectType: AffectType): boolean {
    return !!this.get(affectType).get()
  }

  public get(affectType: AffectType): Maybe<AffectEntity> {
    return new Maybe(this.mob.affects.find(affect => affect.affectType === affectType))
  }

  public add(affect: AffectEntity) {
    const current = this.has(affect.affectType)
    if (!current) {
      this.mob.affects.push(affect)
      if (this.mob instanceof MobEntity) {
        affect.mob = this.mob
      }
    }
  }

  public remove(affectType: AffectType) {
    this.mob.affects = this.mob.affects.filter(affect => affect.affectType !== affectType)
  }

  public reset() {
    this.mob.affects = []
  }
}
