import { faker } from '@faker-js/faker';

export const getUser = () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: "pwd123"
    }
}

// export const getUserWithLinks = () => {
//     const firstName = faker.person.firstName();
//     const lastName = faker.person.lastName();

//     return {
//         name: `${firstName} ${lastName}`,
//         email: faker.internet.email({ firstName, lastName }).toLowerCase(),
//         password: "pwd123",
//         links: [{
//             original_url: faker.internet.url(),
//             title: faker.lorem.words(3)
//         },
//         {
//             original_url: faker.internet.url(),
//             title: faker.lorem.words(3)
//         },
//         {
//             original_url: faker.internet.url(),
//             title: faker.lorem.words(3)
//         },
//         {
//             original_url: faker.internet.url(),
//             title: faker.lorem.words(3)
//         },
//         {
//             original_url: faker.internet.url(),
//             title: faker.lorem.words(3)
//         }]
//     }
// }
