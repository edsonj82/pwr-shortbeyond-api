export const linkService = (request) => {
    
    const createLink = async (link, token) => {
        return await request.post('http://localhost:3333/api/links', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                // original_url: link.original_url,
                // title: link.title
                ...link
            }
        })
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
        getLinks
    }
}