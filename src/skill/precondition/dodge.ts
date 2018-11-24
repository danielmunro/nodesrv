import Check from "../../check/check"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { SkillType } from "../skillType"

export default function(request: Request, service: Service): Promise<Check> {
  return request.checkWithStandingDisposition(service.mobService)
    .requireSkill(SkillType.Dodge)
    .requireLevel(10)
    .requireFight()
    .create()
}
