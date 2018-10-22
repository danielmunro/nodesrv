import { AffectType } from "../../affect/affectType"
import Check from "../../check/check"
import { Mob } from "../../mob/model/mob"
import { Request } from "../../request/request"
import { SpellType } from "../spellType"
import { Messages } from "./constants"

export default function(request: Request): Promise<Check> {
  return request.checkWithStandingDisposition()
    .requireSpell(SpellType.Blind)
    .requireMob(request.getTarget() as Mob)
    .not().requireAffect(AffectType.Blind, Messages.Blind.AlreadyBlind)
    .requireLevel(10)
    .addManaCost(80)
    .create()
}
