import { Request } from "../request/request"
import Check from "./check"

export default class CheckedRequest {
  constructor(
    public readonly request: Request,
    public readonly check: Check,
  ) {}
}
