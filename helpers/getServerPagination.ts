export const getServerPagination = (request: Request, defaultPagination = { page: 1, offset: 10 }) => {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') || defaultPagination.page || 1);
    const offset = Number(searchParams.get('take') || defaultPagination.offset || 10);

    return {
        skip: (page - 1) * offset,
        take: offset,
    }
}