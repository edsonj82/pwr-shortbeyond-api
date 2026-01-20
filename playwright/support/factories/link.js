import { faker } from '@faker-js/faker';

export const getLink = () => {
    const original_url = faker.internet.url();
    const title = faker.lorem.words({ min: 2, max: 5 });

    return {
        original_url: original_url,
        title: title
    }
}

//TODO: refatorar para usar essa função
export const getListLinks = () => {
    return Array.from({ length: 5 }, () => getLink());
}

export const getUserWithLinks = (linksCount = 1) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: "pwd123",
        links: faker.helpers.multiple(() => ({
            original_url: faker.internet.url(),
            title: faker.lorem.words({ min: 2, max: 5 })
        }), { count: linksCount })

        // links: Array.from({ length: 5 }, () => getLink())
        // links: [getLink(), getLink(), getLink(), getLink(), getLink()]
        // links: [{
        //     original_url: faker.internet.url(),
        //     title: faker.lorem.words({ min: 2, max: 5 })
        // },
        // {
        //     original_url: faker.internet.url(),
        //     title: faker.lorem.words({ min: 2, max: 5 })
        // },
        // {
        //     original_url: faker.internet.url(),
        //     title: faker.lorem.words({ min: 2, max: 5 })
        // },
        // {
        //     original_url: faker.internet.url(),
        //     title: faker.lorem.words({ min: 2, max: 5 })
        // },
        // {
        //     original_url: faker.internet.url(),
        //     title: faker.lorem.words({ min: 2, max: 5 })
        // }]

    }
}
