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
  MaterialType.Leather,
]

const conductive = [
  MaterialType.Aluminum,
  MaterialType.Chain,
  MaterialType.Chrome,
  MaterialType.Copper,
  MaterialType.Iron,
  MaterialType.Metal,
  MaterialType.Nickel,
  MaterialType.Platinum,
  MaterialType.Silver,
  MaterialType.Steel,
]

export function isMaterialFlammable(materialType: MaterialType): boolean {
  return flammable.includes(materialType)
}

export function isMaterialConductive(materialType: MaterialType): boolean {
  return conductive.includes(materialType)
}
