import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PdlReport } from '../../pdl-report/entities/pdl-report.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['wildberries', 'ozon'] })
  shopType: string;

  @Column()
  shopName: string;

  @Column()
  shopUid: string;

  @Column()
  clientId: string;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userId: number;

  @JoinColumn({ name: 'pdlReports' })
  @OneToMany(() => PdlReport, (pdlReport) => pdlReport)
  pdlReports: PdlReport[];
}
