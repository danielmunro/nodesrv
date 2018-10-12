import Check from "../../check/check"
import { Request } from "../../request/request"
import { SkillType } from "../skillType"

export default async function(request: Request): Promise<Check> {
  return request.checkWithStandingDisposition()
    .requireSkill(SkillType.EnhancedDamage)
    .requireLevel(30)
    .requireFight()
    .create()
}
