export default class Reset {
  constructor(
    public readonly resetFlag: string,
    public readonly idOfResetSubject: number,
    public readonly idOfResetDestination: number,
  ) {}
}
