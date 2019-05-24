import {Mob} from "../mob/model/mob"
import {AuthorizationLevel} from "./enum/authorizationLevel"

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

/* istanbul ignore next */
export function getAuthorizationLevelName(authorizationLevel: AuthorizationLevel): string {
  switch (authorizationLevel) {
    case AuthorizationLevel.None:
      return "none"
    case AuthorizationLevel.Mortal:
      return "mortal"
    case AuthorizationLevel.Admin:
      return "admin"
    case AuthorizationLevel.Judge:
      return "judge"
    case AuthorizationLevel.Immortal:
      return "immortal"
  }
}

export function isSpecialAuthorizationLevel(authorizationLevel: AuthorizationLevel): boolean {
  return authorizationLevel > AuthorizationLevel.Mortal
}
