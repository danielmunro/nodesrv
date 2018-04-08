import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { SpellType } from "../../spell/spellType"
import { Mob } from "./mob"

@Entity()
export class Spell {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("integer")
  public spellType: SpellType

  @Column("integer")
  public level: number = 1

  @OneToMany((type) => Mob, (mob) => mob.spells)
  public mob: Mob
}