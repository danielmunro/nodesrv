import { SkillType } from "../../skill/skillType"
import { Mob } from "../model/mob"

export enum AttackResult {
  Hit,
  Miss,
  Dodge,
  Parry,
}

export function getSuppressionAttackResultFromSkillType(skill: SkillType): AttackResult {
  if (skill === SkillType.Dodge) {
    return AttackResult.Dodge
  }

  if (skill === SkillType.Parry) {
    return AttackResult.Parry
  }

  return AttackResult.Miss
}

export class Attack {
  public readonly isDefenderAlive: boolean

  constructor(
    public readonly attacker: Mob,
    public readonly defender: Mob,
    public readonly result: AttackResult,
    public readonly damage: number,
    public readonly experience: number = 0) {
    this.isDefenderAlive = defender.vitals.hp >= 0
  }
}
