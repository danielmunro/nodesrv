import AffectService from "../affect/service/affectService"

export default interface Describeable {
  describe(): string
  affect(): AffectService
}
