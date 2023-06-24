import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PdlReport } from '../../pdl-report/entities/pdl-report.entity';

@Entity()
export class PdlReportPosition {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  product_id: number;
  @Column()
  product_name: string;
  @Column()
  offer_id: string;

  @Column()
  count: number;

  @Column({
    default: 0,
  })
  costPrice: string;

  @ManyToOne(() => PdlReport, (pdlReport) => pdlReport.reportPositions)
  @JoinColumn({ name: 'report_id' })
  report_id: number;
}
