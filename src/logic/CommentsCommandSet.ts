import { CommandSet, FilterParams, PagingParams } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';

import { CommentV1Schema } from '../../src/data/version1/CommentV1Schema';
import { ICommentsController } from './ICommentsController';

export class CommentsCommandSet extends CommandSet {
    private _controller: ICommentsController;

    constructor(controller: ICommentsController) {
        super();

        this._controller = controller;

        this.addCommand(this.makeGetCommentsCommand());
        this.addCommand(this.makeGetCommentByIdCommand());
        this.addCommand(this.makeGetCommentByParentIdCommand());
        this.addCommand(this.makeGetCountCommentsByEmojiCommand());
        this.addCommand(this.makeCreateCommentCommand());
        this.addCommand(this.makeUpdateCommentCommand());
        this.addCommand(this.makeDeleteCommentByIdCommand());
        this.addCommand(this.makeLikeCommentCommand());
        this.addCommand(this.makeDislikeCommentCommand());
        this.addCommand(this.makeReportCommentCommand());
    }

    private makeGetCommentsCommand(): ICommand {
        return new Command(
            'get_comments',
            new ObjectSchema(true)
                .withOptionalProperty('filter', new FilterParamsSchema())
                .withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get('filter'));
                let paging = PagingParams.fromValue(args.get('paging'));
                this._controller.getComments(correlationId, filter, paging, callback);
            }
        );
    }

    private makeGetCommentByIdCommand(): ICommand {
        return new Command(
            'get_comment_by_id',
            new ObjectSchema(true)
                .withRequiredProperty('comment_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let commentId = args.getAsString('comment_id');
                this._controller.getCommentById(correlationId, commentId, callback);
            }
        );
    }

    private makeGetCommentByParentIdCommand(): ICommand {
        return new Command(
            'get_comments_by_parent_id',
            new ObjectSchema(true)
                .withRequiredProperty('parent_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let parent_id = args.getAsString('parent_id');
                this._controller.getByParentId(correlationId, parent_id, callback);
            }
        );
    }

    private makeGetCountCommentsByEmojiCommand(): ICommand {
        return new Command(
            'get_count_comments_by_emoji',
            new ObjectSchema(true)
                .withRequiredProperty('content', TypeCode.String)
                .withRequiredProperty('parent_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let content = args.getAsString('content');
                let parent_id = args.getAsString('parent_id');
                this._controller.getCountCommentsByEmoji(correlationId, content, parent_id, callback);
            }
        );
    }

    private makeCreateCommentCommand(): ICommand {
        return new Command(
            'create_comment',
            new ObjectSchema(true)
                .withRequiredProperty('comment', new CommentV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let comment = args.getAsObject('comment');
                this._controller.createComment(correlationId, comment, callback);
            }
        );
    }   

    private makeUpdateCommentCommand(): ICommand {
        return new Command(
            'update_comment',
            new ObjectSchema(true)
                .withRequiredProperty('comment', new CommentV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let comment = args.getAsObject('comment');
                this._controller.updateComment(correlationId, comment, callback);
            }
        );
    }
    
    private makeLikeCommentCommand(): ICommand {
        return new Command(
            'like_comment',
            new ObjectSchema(true)
                .withRequiredProperty('comment', new CommentV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let comment = args.getAsObject('comment');
                this._controller.likeComment(correlationId, comment, callback);
            }
        );
    }   

    private makeDislikeCommentCommand(): ICommand {
        return new Command(
            'dislike_comment',
            new ObjectSchema(true)
                .withRequiredProperty('comment', new CommentV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let comment = args.getAsObject('comment');
                this._controller.dislikeComment(correlationId, comment, callback);
            }
        );
    }   

    private makeReportCommentCommand(): ICommand {
        return new Command(
            'report_comment',
            new ObjectSchema(true)
                .withRequiredProperty('comment', new CommentV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let comment = args.getAsObject('comment');
                this._controller.reportComment(correlationId, comment, callback);
            }
        );
    }   
    
    private makeDeleteCommentByIdCommand(): ICommand {
        return new Command(
            'delete_comment_by_id',
            new ObjectSchema(true)
                .withRequiredProperty('comment_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let commentId = args.getAsString('comment_id');
                this._controller.deleteCommentById(correlationId, commentId, callback);
            }
        );
    }

}