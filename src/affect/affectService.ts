import {Item} from "../item/model/item"
import {Mob} from "../mob/model/mob"
import {AffectType} from "./affectType"
import {Affect} from "./model/affect"

export default class AffectService {
  constructor(private readonly mob: Mob | Item) {}

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
    return !!this.get(affectType)
  }

  public get(affectType: AffectType): Affect | undefined {
    return this.mob.affects.find(affect => affect.affectType === affectType)
  }

  public add(affect: Affect) {
    const current = this.has(affect.affectType)
    if (!current) {
      this.mob.affects.push(affect)
      if (this.mob instanceof Mob) {
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
