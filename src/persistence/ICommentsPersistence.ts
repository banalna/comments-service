import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { CommentV1 } from '../data/version1/CommentV1';

export interface ICommentsPersistence {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<CommentV1>) => void): void;
    
    getOneById(correlationId: string, id: string, 
        callback: (err: any, item: CommentV1) => void): void;

    getByParentId(correlationId: string, parent_id: string, 
        callback: (err: any, items: CommentV1[]) => void): void;

    create(correlationId: string, item: CommentV1, 
        callback: (err: any, item: CommentV1) => void): void;
    
    update(correlationId: string, item: CommentV1, 
        callback: (err: any, item: CommentV1) => void): void;

    deleteById(correlationId: string, id: string, 
        callback: (err: any, item: CommentV1) => void): void;
}