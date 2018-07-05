import connection from "./section/connection"
import matrix from "./section/matrix"
import root from "./section/root"
import { SectionType } from "./sectionType"

export default [
  {
    section: root,
    type: SectionType.Root,
  },
  {
    section: connection,
    type: SectionType.Connection,
  },
  {
    section: matrix,
    type: SectionType.Matrix,
  },
]
