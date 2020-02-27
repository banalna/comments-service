import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { CommentV1 } from '../../../src/data/version1/CommentV1';
import { ICommentsClientV1 } from './ICommentsClientV1';

export class CommentsNullClientV1 implements ICommentsClientV1 {

    public getComments(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CommentV1>) => void): void{
            callback(null, new DataPage([], 0));
        };

    public getCommentById(correlationId: string, id: string,
        callback: (err: any, page: CommentV1) => void): void{
            callback(null, null);
        };

    public getByParentId(correlationId: string, parent_id: string,
        callback: (err: any, page: CommentV1[]) => void): void{
            callback(null, null);
        };

    public getCountCommentsByEmoji(correlationId: string, content: string, parent_id: string,
        callback: (err: any, count_comments: any) => void): void{
            callback(null, null);
        };

    public createComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void{
            callback(null, null);
        };

    public updateComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void{
            callback(null, null);
        };

    public deleteCommentById(correlationId: string, id: string,
        callback: (err: any, comment: CommentV1) => void): void{
            callback(null, null);
        };

     public likeComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void{
            callback(null, null);
        };

     public dislikeComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void{
            callback(null, null);
        };

     public reportComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void{
            callback(null, null);
        };
}