export interface IPage {
    pageNumber: number,
    active: boolean
}

export function getMinAndMax({
    totalPages,
    currentPage,
    maxPages
}: {
    totalPages: number,
    currentPage: number,
    maxPages: number
}): [number, number] {
    const pagesPerSide = Math.floor((maxPages - 1) / 2);
    let remainingLinks = (maxPages - 1) % 2;
    let min = 0, max = 0;

    if(currentPage <= pagesPerSide) {
        remainingLinks += pagesPerSide - currentPage + 1;
        min = 1;
    }

    if(currentPage + pagesPerSide >= totalPages) {
        remainingLinks += pagesPerSide - (totalPages - currentPage);
        max = totalPages;
    }
    
    if(currentPage > pagesPerSide) {
        min = Math.max(1, currentPage - pagesPerSide - remainingLinks);

        remainingLinks -= currentPage - pagesPerSide - min;
    }

    if(currentPage + pagesPerSide < totalPages) {
        max = Math.min(totalPages, currentPage + pagesPerSide + remainingLinks);
    }

    return [min, max];
}

export default function getPages({
    totalPages,
    currentPage,
    maxPages = 7
}: {
    totalPages: number,
    currentPage: number,
    maxPages?: number
}): IPage[] {
    const [min, max] = getMinAndMax({ totalPages, currentPage, maxPages });
    const pages: IPage[] = [];

    for(let pageNumber = min; pageNumber <= max; pageNumber++) {
        pages.push({
            active: pageNumber === currentPage,
            pageNumber
        });
    }

    return pages;
}