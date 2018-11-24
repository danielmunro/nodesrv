import Check from "../../check/check"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { SkillType } from "../skillType"

export default async function(request: Request, service: Service): Promise<Check> {
  return request.check(service.mobService)
    .requireSkill(SkillType.FastHealing)
    .requireLevel(5)
    .create()
}
