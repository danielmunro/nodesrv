import { Request } from "../../server/request/request"

export default interface AuthStep {
  getStepMessage(): string
  processRequest(request: Request): Promise<AuthStep>
}
