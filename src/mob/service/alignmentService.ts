import {MobEntity} from "../entity/mobEntity"
import {Alignment} from "../enum/alignment"

export const ALIGNMENT_EVIL = -300
export const ALIGNMENT_GOOD = 300

export default class AlignmentService {
  constructor(private readonly mob: MobEntity) {}

  public isNeutral() {
    return this.mob.alignment > ALIGNMENT_EVIL && this.mob.alignment < ALIGNMENT_GOOD
  }

  public isEvil() {
    return this.mob.alignment < ALIGNMENT_EVIL
  }

  public isGood() {
    return this.mob.alignment > ALIGNMENT_GOOD
  }

  public getAlignment(): Alignment {
    if (this.isGood()) {
      return Alignment.Good
    } else if (this.isEvil()) {
      return Alignment.Evil
    }

    return Alignment.Neutral
  }
}
