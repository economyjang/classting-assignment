import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Page } from './Page.entity';

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

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => Page, (page) => page.news)
    page: Page;

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
