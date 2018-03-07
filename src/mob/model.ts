export default {
  attributes: {
    direction: "out",
    relationship: "has",
    type: "relationship",
  },
  description: "string",
  experience: "number",
  level: "number",
  mob_id: {
    primary: true,
    type: "uuid",
  },
  name: "string",
  practices: "number",
  race: "string",
  room: {
    direction: "out",
    relationship: "in",
    type: "relationship",
  },
  trains: "number",
  xpPerLevel: "number",
}
