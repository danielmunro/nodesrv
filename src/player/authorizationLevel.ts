export enum AuthorizationLevel {
  None,
  Mortal,
  Admin,
  Judge,
  Immortal,
}

export function isSpecialAuthorizationLevel(authorizationLevel: AuthorizationLevel): boolean {
  return authorizationLevel > AuthorizationLevel.Mortal
}
