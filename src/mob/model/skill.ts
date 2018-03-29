import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { SkillType } from "../skillType"
import { Mob } from "./mob"

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  public id: number

  @Column("integer")
  public skillType: SkillType

  @Column("integer")
  public level: number = 1

  @OneToMany((type) => Mob, (mob) => mob.skills)
  public mob: Mob
}
