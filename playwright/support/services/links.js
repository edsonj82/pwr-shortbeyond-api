export const linkService = (request) => {

    const createLink = async (link, token) => {
        return await request.post('http://localhost:3333/api/links', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                // original_url: link.original_url || link.OriginalURL,
                // title: link.title || link.Title
                ...link
            }
        })
    }

    const getLinkId = async (link, token) => {
        const response = await createLink(link, token);
        const body = await response.json();

        if (response.status() !== 201)
            throw new Error(`Falha ao criar link: ${JSON.stringify(body)}`);

        return body.data.id;
    }

    const getLinks = async (token) => {
        return await request.get('http://localhost:3333/api/links', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    const removeLink = async (linkId, token) => {
        // console.log('Removing link with ID:', linkId);
        console.log('Using token:', token);
        return await request.delete(`http://localhost:3333/api/links/${linkId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    return {
        createLink,
        getLinks,
        getLinkId,
        removeLink
    }
}