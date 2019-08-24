import AffectBuilder from "../../affect/builder/affectBuilder"
import RequestService from "../../messageExchange/service/requestService"
import ApplyAbilityResponse from "../response/applyAbilityResponse"

export type ApplyAbility = (requestService: RequestService, affectBuilder: AffectBuilder) =>
  Promise<ApplyAbilityResponse | void>
