import { AffectType } from "../../affect/affectType"
import Check from "../../check/check"
import { Mob } from "../../mob/model/mob"
import getSight from "../../mob/race/sight"
import { Region } from "../../region/model/region"
import { Request } from "../../request/request"
import Service from "../../service/service"
import { MESSAGE_LOOK_CANNOT_SEE } from "../action/constants"

export default function(request: Request, service: Service): Promise<Check> {
  const room = request.getRoom()

  if (request.mob.getAffect(AffectType.Blind)) {
    return Check.fail(MESSAGE_LOOK_CANNOT_SEE)
  }

  if (somethingIsGlowing(request)) {
    return Check.ok()
  }

  const ableToSee = isAbleToSee(request.mob, room.region, service)

  if (!ableToSee) {
    return Check.fail(MESSAGE_LOOK_CANNOT_SEE)
  }

  return Check.ok()
}

function somethingIsGlowing(request: Request) {
  return request.mob.equipped.inventory.find(isGlowingAffect)
  || request.room.inventory.find(isGlowingAffect)
}

function isGlowingAffect(item) {
  return item.affects.find(affect => affect.affectType === AffectType.Glow)
}

function isAbleToSee(mob: Mob, region: Region = null, service: Service) {
  if (!region) {
    return true
  }

  return getSight(mob.race).isAbleToSee(service.getCurrentTime(), region.terrain, region.weather)
}
