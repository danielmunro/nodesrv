export default class Reset {
  constructor(
    public readonly resetFlag: string,
    public readonly idOfResetSubject: number,
    public readonly idOfResetDestination: number,
    public readonly maxQuantity: number,
    public readonly maxPerRoom: number,
  ) {}
}
