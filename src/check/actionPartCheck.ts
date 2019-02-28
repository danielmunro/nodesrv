import {ActionPart} from "../action/enum/actionPart"
import {Request} from "../request/request"
import CheckBuilder from "./checkBuilder"

export default interface ActionPartCheck {
  getActionPart(): ActionPart
  addToCheckBuilder(checkBuilder: CheckBuilder, request: Request, actionParts: ActionPart[]): any
}
