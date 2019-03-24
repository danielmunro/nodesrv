import { SkillType } from "../../skill/skillType"
import {BASE_KILL_EXPERIENCE} from "../constants"
import { Mob } from "../model/mob"
import modifierNormalizer from "../multiplierNormalizer"
import Death from "./death"

export enum AttackResult {
  Hit,
  Miss,
  Dodge,
  Parry,
  ShieldBlock,
}

export function getSuppressionAttackResultFromSkillType(skill: SkillType): AttackResult {
  if (skill === SkillType.Dodge) {
    return AttackResult.Dodge
  }

  if (skill === SkillType.Parry) {
    return AttackResult.Parry
  }

  if (skill === SkillType.ShieldBlock) {
    return AttackResult.ShieldBlock
  }

  return AttackResult.Miss
}

export class Attack {
  public readonly isDefenderAlive: boolean
  public readonly experience: number = 0

  constructor(
    public readonly attacker: Mob,
    public readonly defender: Mob,
    public readonly result: AttackResult,
    public readonly damage: number,
    public readonly death?: Death) {
    this.isDefenderAlive = defender.vitals.hp >= 0
    if (this.death) {
      this.experience = this.getExperienceFromKilling()
    }
  }

  private getExperienceFromKilling() {
    const levelDelta = this.defender.level - this.attacker.level
    return BASE_KILL_EXPERIENCE * modifierNormalizer(levelDelta)
  }
}
