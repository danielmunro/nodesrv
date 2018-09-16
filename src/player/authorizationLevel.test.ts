import { AuthorizationLevel, isSpecialAuthorizationLevel } from "./authorizationLevel"

describe("authorization level", () => {
  it("isSpecialAuthorizationLevel sanity tests", () => {
    expect(isSpecialAuthorizationLevel(AuthorizationLevel.None)).toBeFalsy()
    expect(isSpecialAuthorizationLevel(AuthorizationLevel.Mortal)).toBeFalsy()
    expect(isSpecialAuthorizationLevel(AuthorizationLevel.Admin)).toBeTruthy()
    expect(isSpecialAuthorizationLevel(AuthorizationLevel.Judge)).toBeTruthy()
    expect(isSpecialAuthorizationLevel(AuthorizationLevel.Immortal)).toBeTruthy()
  })
})
