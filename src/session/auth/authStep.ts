import { Request } from "../../request/request"

export default interface AuthStep {
  getStepMessage(): string
  processRequest(request: Request): Promise<AuthStep>
}
