import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { CommentV1 } from '../../../src/data/version1/CommentV1';

export interface ICommentsClientV1 {
    getComments(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CommentV1>) => void): void;

    getCommentById(correlationId: string, id: string,
        callback: (err: any, page: CommentV1) => void): void;

    getByParentId(correlationId: string, parent_id: string,
        callback: (err: any, page: CommentV1[]) => void): void;

    getCountCommentsByEmoji(correlationId: string, content: string, parent_id: string,
        callback: (err: any, count_comments: any) => void): void;

    createComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void;

    updateComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void;

    deleteCommentById(correlationId: string, id: string,
        callback: (err: any, comment: CommentV1) => void): void;
}