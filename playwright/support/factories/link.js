import { faker } from '@faker-js/faker';

export const getLink = () => {
    const original_url = faker.internet.url();
    const title = faker.lorem.words({ min: 2, max: 5 });

    return {
        original_url: original_url,
        title: title
    }
}