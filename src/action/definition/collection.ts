import { AuthorizationLevel, isSpecialAuthorizationLevel } from "../../player/authorizationLevel"
import { RequestType } from "../../request/requestType"
import { Definition } from "./definition"

export class Collection {
  constructor(
    private readonly actions: Definition[],
    private readonly moderationActions: Definition[],
  ) {}

  public getMatchingHandlerDefinitionForRequestType(
    requestType: RequestType,
    authorizationLevel: AuthorizationLevel = AuthorizationLevel.Mortal,
    defaultHandler: Definition = null,
  ): Definition {
    const action = this.actions.find((it) => it.isAbleToHandleRequestType(requestType))

    if (action) {
      return action
    }

    if (isSpecialAuthorizationLevel(authorizationLevel)) {
      const moderationAction = this.moderationActions.find((it) => it.isAbleToHandleRequestType(requestType))

      if (moderationAction) {
        return moderationAction
      }
    }

    return defaultHandler
  }
}
