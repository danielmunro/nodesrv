import Check from "../../check/check"
import { Request } from "../../request/request"
import { SkillType } from "../skillType"

export default function(request: Request): Promise<Check> {
  return request.checkWithStandingDisposition()
    .requireSkill(SkillType.Dodge)
    .requireLevel(10)
    .requireFight()
    .create()
}
