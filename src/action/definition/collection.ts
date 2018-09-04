import { RequestType } from "../../request/requestType"
import { Definition } from "./definition"
import { AuthorizationLevel } from "../../player/authorizationLevel"

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

    if (authorizationLevel > AuthorizationLevel.Mortal) {
      const moderationAction = this.moderationActions.find((it) => it.isAbleToHandleRequestType(requestType))

      if (moderationAction) {
        return moderationAction
      }
    }

    return defaultHandler
  }
}
