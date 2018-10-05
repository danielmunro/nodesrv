import { Request } from "../../request/request"
import Check from "../../check/check"
import { SkillType } from "../skillType"

export default async function(request: Request): Promise<Check> {
  return request.checkWithStandingDisposition()
    .requireSkill(SkillType.SecondAttack)
    .requireFight()
    .create()
}
