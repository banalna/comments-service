let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;
let expect = require('chai').expect;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { CommentV1 } from '../../src/data/version1/CommentV1';
import { CommentTypeV1 } from '../../src/data/version1/CommentTypeV1';
import { ICommentsPersistence } from '../../src/persistence/ICommentsPersistence';

const COMMENT1: CommentV1 = {

    id: '1',
    parent_id: '15', 
    content: 'test comment id:1',
    author_id: '4545',
    create_time: new Date(Date.UTC(2020, 7, 15, 10,52,34)),
    update_time: new Date(Date.UTC(2020, 7, 17, 11,48,50)),
    like_count: 57,
    dislike_count: 0,
    report_count: 5,
    type: CommentTypeV1.Active,
};
const COMMENT2: CommentV1 = {
    id: '2',
    parent_id: '15', 
    content: 'test comment id:2',
    author_id: '8557',
    create_time: new Date(Date.UTC(2019, 5, 12, 10,20,35)),
    update_time: new Date(Date.UTC(2020, 5, 7, 20,15,5)),
    like_count: 15,
    dislike_count: 5,
    report_count: 5,
    type: CommentTypeV1.Active,
};
const COMMENT3: CommentV1 = {
    id: '3',
    parent_id: '115', 
    content: 'test comment id:3',
    author_id: '1304',
    create_time: new Date(Date.UTC(2019, 7, 12, 21,32,10)),
    like_count: 0,
    dislike_count: 0,
    type: CommentTypeV1.Archived,
    archive_time: new Date(Date.UTC(2020, 10, 15, 11,50,14)),
};

export class CommentsPersistenceFixture {
    private _persistence: ICommentsPersistence;

    public constructor(persistence: ICommentsPersistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testCreateComments(done) {
        async.series([
            // Create the first comment
            (callback) => {
                this._persistence.create(
                    null,
                    COMMENT1,
                    (err, comment) => {
                        assert.isNull(err);
                        assert.isObject(comment);
                        assert.equal(COMMENT1.parent_id, comment.parent_id);
                        assert.equal(COMMENT1.content, comment.content);
                        assert.equal(COMMENT1.author_id, comment.author_id);
                        assert.equal(COMMENT1.create_time.toUTCString(), comment.create_time.toUTCString());
                        assert.equal(COMMENT1.like_count, comment.like_count);
                        assert.equal(COMMENT1.dislike_count, comment.dislike_count);

                        callback();
                    }
                );
            },
            // Create the second comment
            (callback) => {
                this._persistence.create(
                    null,
                    COMMENT2,
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(COMMENT2.parent_id, comment.parent_id);
                        assert.equal(COMMENT2.content, comment.content);
                        assert.equal(COMMENT2.author_id, comment.author_id);
                        assert.equal(COMMENT2.create_time.toUTCString(), comment.create_time.toUTCString());
                        assert.equal(COMMENT2.like_count, comment.like_count);
                        assert.equal(COMMENT2.dislike_count, comment.dislike_count);

                        callback();
                    }
                );
            },
            // Create the third comment
            (callback) => {
                this._persistence.create(
                    null,
                    COMMENT3,
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(COMMENT3.parent_id, comment.parent_id);
                        assert.equal(COMMENT3.content, comment.content);
                        assert.equal(COMMENT3.author_id, comment.author_id);
                        assert.equal(COMMENT3.create_time.toUTCString(), comment.create_time.toUTCString());
                        assert.equal(COMMENT3.like_count, comment.like_count);
                        assert.equal(COMMENT3.dislike_count, comment.dislike_count);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testCrudOperations(done) {
        let comment1: CommentV1;

        async.series([
            // Create items
            (callback) => {
                this.testCreateComments(callback);
            },
            // Get all comments
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page,);
                        assert.lengthOf(page.data, 3);

                        comment1 = page.data[0];

                        callback();
                    }
                )
            },
            // Update the comment
            (callback) => {
                comment1.content = 'update content test';
                comment1.update_time = new Date(Date.UTC(2025, 3, 10, 15,10,5));
                this._persistence.update(
                    null,
                    comment1,
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment1.id, comment.id);
                        assert.equal(comment1.content, comment.content);
                        assert.equal(comment1.update_time.toUTCString(), comment.update_time.toUTCString());

                        callback();
                    }
                )
            },
            // Get comments by parent_id
            (callback) => {
                this._persistence.getByParentId(
                    null, 
                    comment1.parent_id,
                    (err, comment:CommentV1[]) => {
                        assert.isNull(err);
                        assert.isArray(comment);
                        comment.forEach(element=>assert.equal(comment1.parent_id, element.parent_id ));
                        callback();
                    }
                )
            },
            // Delete the comment
            (callback) => {
                this._persistence.deleteById(
                    null,
                    comment1.id,
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment1.id, comment.id, );

                        callback();
                    }
                )
            },
            // Try to get deleted comment
            (callback) => {
                this._persistence.getOneById(
                    null,
                    comment1.id,
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isNull(comment || null);

                        callback();
                    }
                )
            }
        ], done);
    }

    public testGetWithFilters(done) {
        async.series([
            // Create items
            (callback) => {
                this.testCreateComments(callback);
            },
            // Filter by id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'id', '1'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                )
            },
            // Filter by parent_id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'parent_id', '115'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                )
            },

            // Filter by create_time
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'time_from', new Date(Date.UTC(2018, 7, 12, 21,32,10)),
                        'time_to', new Date(Date.UTC(2020, 7, 12, 21,32,10))
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                )
            },
            
            // Filter by author_id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'author_id', '8557'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                )
            },

            // Filter by authors_id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'authors_id', '4545,1304'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                )
            },
            // Filter by content
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromTuples(
                        'content', 'test comment id:3'
                    ),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                )
            },
        ], done);
    }
}
