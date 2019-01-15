import { AuthorizationLevel, isSpecialAuthorizationLevel } from "../../player/authorizationLevel"
import { RequestType } from "../../request/requestType"
import { Action } from "./action"

export class Collection {
  constructor(
    private readonly actions: Action[],
    private readonly moderationActions: Action[],
    private readonly defaultAction: Action = null,
  ) {}

  public getMatchingHandlerDefinitionForRequestType(
    requestType: RequestType,
    authorizationLevel: AuthorizationLevel = AuthorizationLevel.Mortal,
  ): Action {
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

    return this.defaultAction
  }
}
