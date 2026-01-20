import { test, expect } from "../../support/fixtures";

import { getUserWithLinks } from "../../support/factories/link";


test.describe('DELETE /links/:id', () => {

    test('should delete a link successfully', async ({ authorization, links }) => {
        const user = getUserWithLinks()

        await authorization.createUser(user);
        const token = await authorization.getToken(user)
        const linkId = await links.getLinkId(user.links[0], token)

        console.log('Link ID to delete:', linkId);

    })

})
