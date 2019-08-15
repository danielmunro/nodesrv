import {Column, Entity, Generated, PrimaryGeneratedColumn} from "typeorm"
import v4 from "uuid"
import {DamageType} from "../fight/enum/damageType"

@Entity()
export default class DamageSourceEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  @Generated("uuid")
  public uuid: string = v4()

  @Column({ default: false })
  public summon: boolean

  @Column({ default: false })
  public charm: boolean

  @Column({ default: false })
  public magic: boolean

  @Column({ default: false })
  public weapon: boolean

  @Column({ default: false })
  public bash: boolean

  @Column({ default: false })
  public slash: boolean

  @Column({ default: false })
  public pierce: boolean

  @Column({ default: false })
  public fire: boolean

  @Column({ default: false })
  public cold: boolean

  @Column({ default: false })
  public lightning: boolean

  @Column({ default: false })
  public acid: boolean

  @Column({ default: false })
  public poison: boolean

  @Column({ default: false })
  public negative: boolean

  @Column({ default: false })
  public holy: boolean

  @Column({ default: false })
  public energy: boolean

  @Column({ default: false })
  public mental: boolean

  @Column({ default: false })
  public disease: boolean

  @Column({ default: false })
  public drowning: boolean

  @Column({ default: false })
  public light: boolean

  @Column({ default: false })
  public sound: boolean

  @Column({ default: false })
  public wood: boolean

  @Column({ default: false })
  public silver: boolean

  @Column({ default: false })
  public iron: boolean

  @Column({ default: false })
  public distraction: boolean

  public isDamageTypeActive(damageType: DamageType): boolean {
    switch (damageType) {
      case DamageType.Mental:
        return this.mental
      case DamageType.Bash:
        return this.bash
      default:
        return false
    }
  }
}
