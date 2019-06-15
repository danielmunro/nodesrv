import CreationService from "../service/creationService"

export default class AbstractAuthStep {
  constructor(protected readonly creationService: CreationService) {}
}
