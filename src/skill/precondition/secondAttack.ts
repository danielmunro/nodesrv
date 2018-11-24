import Check from "../../check/check"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { SkillType } from "../skillType"

export default async function(request: Request, service: Service): Promise<Check> {
  return request.checkWithStandingDisposition(service.mobService)
    .requireSkill(SkillType.SecondAttack)
    .requireLevel(10)
    .requireFight()
    .create()
}
