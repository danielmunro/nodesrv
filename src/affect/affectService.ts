import {Mob} from "../mob/model/mob"
import {AffectType} from "./affectType"
import {Affect} from "./model/affect"

export default class AffectService {
  constructor(private readonly mob: Mob) {}

  public canDetectInvisible(): boolean {
    return this.mob.affects.find(a => a.affectType === AffectType.DetectInvisible) !== undefined
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
      affect.mob = this.mob
    }
  }

  public remove(affectType: AffectType) {
    this.mob.affects = this.mob.affects.filter(affect => affect.affectType !== affectType)
  }
}
