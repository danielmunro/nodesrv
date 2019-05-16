import CreationService from "./creationService"

export default class AbstractAuthStep {
  constructor(protected readonly creationService: CreationService) {}
}
