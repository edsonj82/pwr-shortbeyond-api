export const linkService = (request) => {

    const createLink = async (link, token) => {
        console.log('Dados do link recebidos no service:', link);

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
        console.log('Getting Link ID for link:', link);
        const response = await createLink(link, token);
        const body = await response.json();

        if (response.status() !== 201)
            // console.log('ERRO na API:', body);
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
    return {
        createLink,
        getLinks,
        getLinkId
    }
}