import Check from "../../check/check"
import { Request } from "../../request/request"
import { SkillType } from "../skillType"

export default async function(request: Request): Promise<Check> {
  return request.check()
    .requireSkill(SkillType.FastHealing)
    .create()
}
