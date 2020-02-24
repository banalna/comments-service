let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { CommentV1 } from '../data/version1/CommentV1';
import { ICommentsPersistence } from './ICommentsPersistence';
import { CommentsMongoDbSchema } from './CommentsMongoDbSchema';

export class CommentsMongoDbPersistence
    extends IdentifiableMongoDbPersistence<CommentV1, string>
    implements ICommentsPersistence {

    constructor() {
        super('comments', CommentsMongoDbSchema());
        this._maxPageSize = 1000;
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let criteria = [];

        let id = filter.getAsNullableString('id');
        if (id != null) 
            criteria.push({ _id: id });

        let parent_id = filter.getAsNullableString('parent_id');
        if (parent_id != null)
            criteria.push({ parent_id: parent_id });

        let content = filter.getAsNullableString('content');
        if (content != null)
            criteria.push({ content: content });

        let create_time = filter.getAsNullableString('create_time');
        if (create_time != null) {
            criteria.push({ create_time: create_time });
        }

        let author_id = filter.getAsNullableString('author_id');
        if (author_id != null) {
            criteria.push({ author_id: author_id });
        }

        let authors_id = filter.getAsObject('authors_id');
        if (_.isString(authors_id))
            authors_id = authors_id.split(',');
        if (_.isArray(authors_id))
            criteria.push({ author_id: { $in: authors_id } });

        return criteria.length > 0 ? { $and: criteria } : null;
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CommentV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public getByParentId(correlationId: string, parent_id: string,
        callback: (err: any, items: CommentV1[]) => void): void {

        let criteria = {
            parent_id: parent_id
        };

        this._model.find(criteria, (err, item) => {
            item = this.convertFromPublic(item);

            if (item != null) this._logger.trace(correlationId, "Found comment by %s", parent_id);
            else this._logger.trace(correlationId, "Cannot find comment by %s", parent_id);

            callback(err, item);
        });
    }
}