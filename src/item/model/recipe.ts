import {Column, Entity, Generated, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"
import {SpellType} from "../../spell/spellType"
import Forge from "./forge"
import {Item} from "./item"

@Entity()
export default class Recipe {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("text")
  @Generated("uuid")
  public uuid: string = v4()

  @Column("text")
  public importId: string

  @Column("integer")
  public spellType: SpellType

  @Column("integer")
  public difficulty: number

  @OneToOne(() => Item)
  public createsItem: Item

  @ManyToOne(() => Forge, forge => forge.recipes)
  public forge: Forge
}
