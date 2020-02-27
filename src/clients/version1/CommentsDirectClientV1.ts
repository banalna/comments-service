import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { DirectClient } from 'pip-services3-rpc-node';
import { Descriptor } from 'pip-services3-commons-node';

import { CommentV1 } from '../../../src/data/version1/CommentV1';
import { ICommentsClientV1 } from './ICommentsClientV1';
import { ICommentsController } from '../../../src/logic/ICommentsController';

export class CommentsDirectClientV1 extends DirectClient<ICommentsController> implements ICommentsClientV1 {
    public constructor() {
        super();
        this._dependencyResolver.put('controller', new Descriptor('comments', 'controller', '*', '*', '1.0'));
    }

    public getComments(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CommentV1>) => void): void {
        let timing = this.instrument(correlationId, 'comments.get_comments');
        this._controller.getComments(correlationId, filter, paging, (err, page) => {
            timing.endTiming();
            callback(err, page);
        });
    }

    public getCommentById(correlationId: string, commentId: string,
        callback: (err: any, comment: CommentV1) => void): void {
        let timing = this.instrument(correlationId, 'comments.get_comment_by_id');
        this._controller.getCommentById(correlationId, commentId, (err, comment) => {
            timing.endTiming();
            callback(err, comment);
        }); 
    }

    public getByParentId(correlationId: string, parent_id: string,
        callback: (err: any, page: CommentV1[]) => void): void {
        let timing = this.instrument(correlationId, 'comments.get_comments_by_parent_id');
        this._controller.getByParentId(correlationId, parent_id, (err, comment) => {
            timing.endTiming();
            callback(err, comment);
        }); 
    }

    public getCountCommentsByEmoji(correlationId: string, content: string, parent_id:string,
        callback: (err: any, count_comments: any) => void): void {
        let timing = this.instrument(correlationId, 'comments.get_count_comments_by_emoji');
        this._controller.getCountCommentsByEmoji(correlationId, content, parent_id, (err, count_comments) => {
            timing.endTiming();
            callback(err, count_comments);
        }); 
    }

    public createComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void {
        let timing = this.instrument(correlationId, 'comments.create_comment');
        this._controller.createComment(correlationId, comment, (err, comment) => {
            timing.endTiming();
            callback(err, comment);
        }); 
    }

    public updateComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void {
        let timing = this.instrument(correlationId, 'comments.update_comment');
        this._controller.updateComment(correlationId, comment, (err, comment) => {
            timing.endTiming();
            callback(err, comment);
        }); 
    }

    public deleteCommentById(correlationId: string, commentId: string,
        callback: (err: any, comment: CommentV1) => void): void {
        let timing = this.instrument(correlationId, 'comments.delete_beacon_by_id');
        this._controller.deleteCommentById(correlationId, commentId, (err, comment) => {
            timing.endTiming();
            callback(err, comment);
        }); 
    }

    public likeComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void {
        let timing = this.instrument(correlationId, 'comments.like_comment');
        this._controller.likeComment(correlationId, comment, (err, comment) => {
            timing.endTiming();
            callback(err, comment);
        }); 
    }

    public dislikeComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void {
        let timing = this.instrument(correlationId, 'comments.dislike_comment');
        this._controller.dislikeComment(correlationId, comment, (err, comment) => {
            timing.endTiming();
            callback(err, comment);
        }); 
    }

    public reportComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void {
        let timing = this.instrument(correlationId, 'comments.report_comment');
        this._controller.reportComment(correlationId, comment, (err, comment) => {
            timing.endTiming();
            callback(err, comment);
        }); 
    }
}