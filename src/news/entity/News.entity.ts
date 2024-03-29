import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Page } from '../../page/entity/Page.entity';

@Entity()
export class News {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    subject: string;

    @Column()
    content: string;

    @Column()
    created_by: string;

    @ManyToOne(() => Page, (page) => page.news)
    page: Page;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    setSubject(subject: string) {
        this.subject = subject;
        return this;
    }

    setContent(content: string) {
        this.content = content;
        return this;
    }

    setCreatedBy(createdBy: string) {
        this.created_by = createdBy;
        return this;
    }

    setPage(page: Page) {
        this.page = page;
        return this;
    }
}
