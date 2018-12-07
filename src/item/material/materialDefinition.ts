import { MaterialType } from "./materialType"

export default class MaterialDefinition {
  constructor(
    public readonly materialType: MaterialType,
    public readonly durability: number,
    public readonly brittleness: number,
  ) {}
}
