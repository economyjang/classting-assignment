import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from './entity/Page.entity';
import { Repository } from 'typeorm';
import { PageDto } from './dto/PageDto';
import { User } from '../auth/entity/User.entity';
import { SubscriptionDto } from './dto/SubscriptionDto';
import { Subscription } from './entity/Subscription.entity';

@Injectable()
export class PageService {
    constructor(
        @InjectRepository(Page) private pageRepository: Repository<Page>,
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
    ) {}

    async createPage(user: User, pageDto: PageDto) {
        const page = new Page()
            .setName(pageDto.name)
            .setRegion(pageDto.region)
            .setManager(user);
        await this.pageRepository.save(page);
    }

    async subscribePage(user: User, subscriptionDto: SubscriptionDto) {
        const page = await this.pageRepository.findOne({
            where: { id: subscriptionDto.id },
        });
        if (!page) {
            throw new NotFoundException('존재하지 않는 페이지 입니다.');
        }

        const subscription = new Subscription().setUser(user).setPage(page);
        await this.subscriptionRepository.save(subscription);
    }

    async unSubscribePage(user: User, subscriptionDto: SubscriptionDto) {
        const page = await this.pageRepository.findOne({
            where: { id: subscriptionDto.id },
        });
        if (!page) {
            throw new NotFoundException('존재하지 않는 페이지 입니다.');
        }

        await this.subscriptionRepository.softDelete({ user, page });
    }
}
