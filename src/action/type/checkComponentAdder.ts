import CheckBuilder from "../../check/builder/checkBuilder"
import Request from "../../messageExchange/request"

export type CheckComponentAdder = (request: Request, checkBuilder: CheckBuilder) => void
