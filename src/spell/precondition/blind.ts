import { AffectType } from "../../affect/affectType"
import Check from "../../check/check"
import { Mob } from "../../mob/model/mob"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { SpellType } from "../spellType"
import { Messages } from "./constants"

export default function(request: Request, service: Service): Promise<Check> {
  return request.checkWithStandingDisposition(service.mobService)
    .requireSpell(SpellType.Blind)
    .requireMob(request.getTarget() as Mob)
    .not().require(mob => mob.getAffect(AffectType.Blind), Messages.Blind.AlreadyBlind)
    .requireLevel(10)
    .addManaCost(80)
    .create()
}
