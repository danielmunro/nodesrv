import { AffectType } from "../../affect/affectType"
import Check from "../../check/check"
import { Mob } from "../../mob/model/mob"
import { Request } from "../../request/request"
import { SpellType } from "../spellType"
import { Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  return request.checkWithStandingDisposition()
    .requireSpell(SpellType.Poison)
    .requireMob(request.getTarget() as Mob)
    .not().requireAffect(AffectType.Poison, Messages.Poison.AlreadyPoisoned)
    .requireLevel(20)
    .addManaCost(50)
    .create()
}
