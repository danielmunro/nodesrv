import {MaterialType} from "../enum/materialType"

const flammable = [
  MaterialType.Wood,
  MaterialType.Vegetation,
  MaterialType.Paper,
  MaterialType.Cotton,
  MaterialType.Cork,
  MaterialType.Coal,
  MaterialType.Cloth,
  MaterialType.CherryWood,
  MaterialType.Bread,
  MaterialType.Bamboo,
  MaterialType.Alcohol,
]

export function isMaterialFlammable(materialType: MaterialType): boolean {
  return flammable.includes(materialType)
}
