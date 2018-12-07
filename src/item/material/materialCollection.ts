import MaterialDefinition from "./materialDefinition"
import { MaterialType } from "./materialType"

export default [
  new MaterialDefinition(MaterialType.Wood, 0.3, 0.1),
  new MaterialDefinition(MaterialType.Iron, 0.7, 0.3),
  new MaterialDefinition(MaterialType.Steel, 0.8, 0.2),
]
