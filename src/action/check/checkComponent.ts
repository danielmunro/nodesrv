import { CheckType } from "./checkType"

export default class CheckComponent {
  constructor(public readonly checkType: CheckType, public readonly thing, public readonly failMessage: string) {}
}
