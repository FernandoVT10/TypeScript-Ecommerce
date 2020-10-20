export interface IPagination {
    hasPrevPage: boolean,
    prevPage: number,
    hasNextPage: boolean,
    nextPage: number,
    pages: {
        active: boolean,
        pageNumber: number
    }[]
}

export default function paginate(totalPages: number, cursor: number): IPagination {
    let remainingLinks = 6;
    let minPage = 0, maxPage = 0;

    if(cursor + 3 > totalPages) {
        remainingLinks -= totalPages - cursor;
        maxPage = totalPages;
    } else {
        remainingLinks -= 3;
        
        if(cursor < 4) {
            if(totalPages > 7) {
                maxPage = 7;
            } else {
                maxPage = totalPages;
            }
        } else {
            maxPage = cursor + 3;
        }
    }

    if(cursor - remainingLinks > 0) {
        minPage = cursor - remainingLinks;
    } else {
        minPage = 1;
    }

    const result: IPagination = {
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        pages: []
    };

    if(cursor > 1) {
        result.hasPrevPage = true;
        result.prevPage = cursor - 1;
    }

    if(cursor < totalPages) {
        result.hasNextPage = true;
        result.nextPage = cursor + 1;
    }

    for(let i = minPage; i <= maxPage; i++) {
        if(i === cursor) {
            result.pages.push({
                active: true,
                pageNumber: i
            });
        } else {
            result.pages.push({
                active: false,
                pageNumber: i
            });
        }
    }

    return result;
}