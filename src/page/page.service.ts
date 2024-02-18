import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from './entity/Page.entity';
import { Repository } from 'typeorm';
import { PageDto } from './dto/PageDto';
import { User } from '../auth/entity/User.entity';

@Injectable()
export class PageService {
    constructor(
        @InjectRepository(Page) private pageRepository: Repository<Page>,
    ) {}

    async createPage(user: User, pageDto: PageDto) {
        const page = new Page()
            .setName(pageDto.name)
            .setRegion(pageDto.region)
            .setManager(user);
        await this.pageRepository.save(page);
    }
}
