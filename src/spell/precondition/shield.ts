import Check from "../../check/check"
import { Mob } from "../../mob/model/mob"
import { Request } from "../../request/request"
import { SpellType } from "../spellType"

export default function(request: Request): Promise<Check> {
  return request.checkWithStandingDisposition()
    .requireSpell(SpellType.Shield)
    .optionalMob(request.getTarget() as Mob)
    .requireLevel(5)
    .addManaCost(50)
    .create()
}
