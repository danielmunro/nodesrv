import Request from "./request"
import Response from "./response"

export default interface AuthStep {
  getStepMessage(): string
  processRequest(request: Request): Promise<Response>
}
