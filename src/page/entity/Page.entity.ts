import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entity/User.entity';
import { News } from '../../news/entity/News.entity';

@Entity()
export class Page {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    region: string;

    @OneToOne(() => User, (user) => user.page)
    @JoinColumn()
    manager: User;

    @OneToMany(() => News, (news) => news.page)
    news: News[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    setName(name: string) {
        this.name = name;
        return this;
    }

    setRegion(region: string) {
        this.region = region;
        return this;
    }

    setManager(manager: User) {
        this.manager = manager;
        return this;
    }

    setNews(news: News) {
        this.news.push(news);
        return this;
    }
}
