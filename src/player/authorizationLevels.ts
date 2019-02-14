import {Mob} from "../mob/model/mob"
import {AuthorizationLevel} from "./authorizationLevel"

const authorizationLevels = [
  AuthorizationLevel.None,
  AuthorizationLevel.Mortal,
  AuthorizationLevel.Admin,
  AuthorizationLevel.Judge,
  AuthorizationLevel.Immortal,
]

export default authorizationLevels

export function getNextPromotion(mob: Mob) {
  const currentIndex = authorizationLevels.findIndex(value => value === mob.getAuthorizationLevel())
  return authorizationLevels[currentIndex + 1]
}

export function getNextDemotion(mob: Mob) {
  const currentIndex = authorizationLevels.findIndex(value => value === mob.getAuthorizationLevel())
  return authorizationLevels[currentIndex - 1]
}
