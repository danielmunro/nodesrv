export default class ItemPrototype {
  constructor(
    public readonly type: string,
    public readonly name: string,
    public readonly description: string,
    public readonly args: string[],
  ) {}
}
