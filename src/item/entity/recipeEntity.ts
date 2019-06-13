import {Column, Entity, Generated, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm"
import * as v4 from "uuid"
import {SpellType} from "../../spell/spellType"
import ForgeEntity from "./forgeEntity"
import {ItemEntity} from "./itemEntity"

@Entity()
export default class RecipeEntity {
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

  @OneToOne(() => ItemEntity)
  public createsItem: ItemEntity

  @ManyToOne(() => ForgeEntity, forge => forge.recipes)
  public forge: ForgeEntity
}
