let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { CommentV1 } from '../data/version1/CommentV1';
import { ICommentsPersistence } from './ICommentsPersistence';

export class CommentsMemoryPersistence
    extends IdentifiableMemoryPersistence<CommentV1, string>
    implements ICommentsPersistence {

    constructor() {
        super();

        this._maxPageSize = 1000;
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let id = filter.getAsNullableString('id');
        let parent_id = filter.getAsNullableString('parent_id');
        let content = filter.getAsNullableString('content');
        let type = filter.getAsNullableString('type');
        let create_time = filter.getAsNullableString('create_time') 
        let author_id = filter.getAsNullableString('author_id');
        let authors_id = filter.getAsObject('authors_id');
        if (_.isString(authors_id))
            authors_id = authors_id.split(',');
        if (!_.isArray(authors_id))
            authors_id = null;


        return (item) => {
            if (id != null && item.id != id)
                return false;
            if (parent_id != null && item.parent_id != parent_id)
                return false;
            if (content != null && item.content != content)
                return false;
            if (type != null && item.type != type)
                return false;
            if (create_time != null && item.create_time != create_time)
                return false;
            if (author_id != null && item.author_id != author_id)
                return false;
            if (authors_id != null && _.indexOf(authors_id, item.author_id) < 0)
                return false;
            return true;
        };
        
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CommentV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public getByParentId(correlationId: string, parent_id: string,
        callback: (err: any, items: CommentV1[]) => void): void {
        let item = _.filter(this._items, (items) => items.parent_id == parent_id);
        if (item != null) this._logger.trace(correlationId, "Found comment by %s", parent_id);
        else this._logger.trace(correlationId, "Cannot find comment by %s", parent_id);

        callback(null, item);
    }
}