import { Race } from "./../mob/race/race"
import { Attributes } from "./attributes"

export interface Modifier {
  (race: Race, attributes: Attributes): Attributes
}