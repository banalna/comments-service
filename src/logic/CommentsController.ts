let _ = require('lodash');
let async = require('async');

import { FilterParams, ICommandable } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';

import { CommentV1 } from '../../src/data/version1/CommentV1';
import { ICommentsPersistence } from '../../src/persistence/ICommentsPersistence';
import { ICommentsController } from './ICommentsController';
import { CommentTypeV1 } from '../../src/data/version1/CommentTypeV1';
import { CommentsCommandSet } from './CommentsCommandSet';


export class CommentsController implements ICommentsController, IConfigurable, IReferenceable, ICommandable {
    private _persistence: ICommentsPersistence;
    private _commandSet: CommentsCommandSet;

    public constructor() { }

    public configure(config: ConfigParams): void {

    }

    public setReferences(references: IReferences): void {
        this._persistence = references.getOneRequired<ICommentsPersistence>(
            new Descriptor('comments', 'persistence', '*', '*', '1.0')
        );
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null) {
            this._commandSet = new CommentsCommandSet(this);
        }

        return this._commandSet;
    }

    public getComments(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CommentV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getCommentById(correlationId: string, id: string,
        callback: (err: any, page: CommentV1) => void): void {
            this._persistence.getOneById(correlationId, id, callback);
    }

    public getByParentId(correlationId: string, parent_id: string,
        callback: (err: any, page: CommentV1[]) => void): void {
            this._persistence.getByParentId(correlationId, parent_id, callback);
    }

    public getCountCommentsByEmoji(correlationId: string, content: string, parent_id:string,
        callback: (err: any, count_comments: any) => void): void {
            let comments: CommentV1[];
            let count_comments:any = null;

            async.series([
                (callback) => { 
                    this._persistence.getByParentId(
                        correlationId,
                        parent_id,

                        (err, items) => {
                            comments = items;
                            callback(err);
                        }
                    );
                },
                (callback) =>{
                    let count = 0;
                    comments.forEach(element=>{
                        if (element.content==content)
                            count += 1; 
                    });
                    count_comments = {
                        count:count,
                        comments: comments
                    }

                    callback();
                }
            ], (err) => { callback(err, err == null ? count_comments : null);  });
    }
    
    public createComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void {
            comment.id = comment.id || IdGenerator.nextLong();
            comment.type = comment.type || CommentTypeV1.Active;

            this._persistence.create(correlationId, comment, callback);
    }

    public updateComment(correlationId: string, comment: CommentV1,
        callback: (err: any, comment: CommentV1) => void): void {
            comment.type = comment.type || CommentTypeV1.Active;

            this._persistence.update(correlationId, comment, callback);
    }

    public deleteCommentById(correlationId: string, id: string,
        callback: (err: any, comment: CommentV1) => void): void {
            this._persistence.deleteById(correlationId, id, callback);
    }

}