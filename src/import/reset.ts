export default class Reset {
  constructor(
    public readonly resetType: string,
    public readonly idOfResetSubject: number,
    public readonly idOfResetDestination: number,
  ) {}
}
