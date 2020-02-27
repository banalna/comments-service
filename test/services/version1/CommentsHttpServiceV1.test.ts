let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;
let restify = require('restify');

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { CommentV1 } from '../../../src/data/version1/CommentV1';
import { CommentTypeV1 } from '../../../src/data/version1/CommentTypeV1';
import { CommentsMemoryPersistence } from '../../../src/persistence/CommentsMemoryPersistence';
import { CommentsController } from '../../../src/logic/CommentsController';
import { CommentsHttpServiceV1 } from '../../../src/services/version1/CommentsHttpServiceV1';

const COMMENT1: CommentV1 = {

    id: '1',
    parent_id: '34', 
    content: "😀".codePointAt(0).toString(10),
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
    parent_id: '77', 
    content: 'test comment id:2',
    author_id: '8557',
    create_time: new Date(Date.UTC(2019, 5, 12, 10,20,35)),
    update_time: new Date(Date.UTC(2020, 5, 7, 20,15,5)),
    like_count: 15,
    dislike_count: 5,
    type: CommentTypeV1.Active,
};
const COMMENT3: CommentV1 = {
    id: '3',
    parent_id: '34', 
    content: "😀".codePointAt(0).toString(10),
    author_id: '1304',
    create_time: new Date(Date.UTC(2019, 7, 12, 21,32,10)),
    like_count: 0,
    dislike_count: 0,
    type: CommentTypeV1.Archived,
    archive_time: new Date(Date.UTC(2020, 10, 15, 11,50,14)),
};

suite('CommentsHttpServiceV1', () => {
    let persistence: CommentsMemoryPersistence;
    let controller: CommentsController;
    let service: CommentsHttpServiceV1;
    let rest: any;

    setup((done) => {
        let url = "http://localhost:3000";
        rest = restify.createJsonClient({ url: url, version: '*'});

        persistence = new CommentsMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new CommentsController();
        controller.configure(new ConfigParams());

        service = new CommentsHttpServiceV1();
        service.configure(ConfigParams.fromTuples(
            'connection.protocol', 'http',
            'connection.port', 3000,
            'connection.host', 'localhost'
        ));

        let references = References.fromTuples(
            new Descriptor('comments', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('comments', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('comments', 'service', 'http', 'default', '1.0'), service
        );

        controller.setReferences(references);
        service.setReferences(references);

        persistence.open(null, (err) => {
            if (err) {
                done(err);
                return;
            }

            service.open(null, done);
        });
    });

    teardown((done) => {
        service.close(null, (err) => {
            persistence.close(null, done);
        });
    });

    test('CRUD Operations', (done) => {

        let comment1: CommentV1;

        async.series([
            // Create the first comment
            (callback) => {
                rest.post('/v1/comments/create_comment',
                    {
                        comment: COMMENT1
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);
                        assert.isObject(comment);
                        assert.equal(COMMENT1.parent_id, comment.parent_id);
                        assert.equal(COMMENT1.content, comment.content);
                        assert.equal(COMMENT1.author_id, comment.author_id);
                        // assert.equal(COMMENT1.create_time.toUTCString(), comment.create_time.toUTCString());
                        assert.equal(COMMENT1.like_count, comment.like_count);
                        assert.equal(COMMENT1.dislike_count, comment.dislike_count);

                        callback();
                    }
                );
            },
            // Create the second comment
            (callback) => {
                rest.post('/v1/comments/create_comment',
                    {
                        comment: COMMENT2
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);
                        assert.isObject(comment);
                        assert.equal(COMMENT2.parent_id, comment.parent_id);
                        assert.equal(COMMENT2.content, comment.content);
                        assert.equal(COMMENT2.author_id, comment.author_id);
                        // assert.equal(COMMENT2.create_time.toUTCString(), comment.create_time.toUTCString());
                        assert.equal(COMMENT2.like_count, comment.like_count);
                        assert.equal(COMMENT2.dislike_count, comment.dislike_count);

                        callback();
                    }
                );
            },
            // Create the third comment
            (callback) => {
                rest.post('/v1/comments/create_comment',
                    {
                        comment: COMMENT3
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);
                        assert.isObject(comment);
                        assert.equal(COMMENT3.parent_id, comment.parent_id);
                        assert.equal(COMMENT3.content, comment.content);
                        assert.equal(COMMENT3.author_id, comment.author_id);
                        // assert.equal(COMMENT3.create_time.toUTCString(), comment.create_time.toUTCString());
                        assert.equal(COMMENT3.like_count, comment.like_count);
                        assert.equal(COMMENT3.dislike_count, comment.dislike_count);

                        callback();
                    }
                );
            },
            // Get all comments
            (callback) => {
                rest.post('/v1/comments/get_comments',
                    {
                        filter: new FilterParams(),
                        paging: new PagingParams()
                    },
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        comment1 = page.data[0];

                        callback();
                    }
                )
            },
            // Update the comment
            (callback) => {
                comment1.type = CommentTypeV1.Archived;
                comment1.update_time = new Date(Date.UTC(2025, 3, 10, 15,10,5));

                rest.post('/v1/comments/update_comment',
                    {
                        comment: comment1
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment1.id, comment.id);
                        assert.equal(comment1.type, comment.type);
                        // assert.equal(comment1.update_time.toUTCString(), comment.update_time.toUTCString());

                        callback();
                    }
                )
            },
            // Get comments by parent_id
            (callback) => {
                rest.post('/v1/comments/get_comments_by_parent_id',
                    {
                        parent_id: comment1.parent_id
                    },
                    (err, req, res, comment:CommentV1[]) => {
                        assert.isNull(err);

                        assert.isArray(comment);
                        comment.forEach(element=>assert.equal(comment1.parent_id, element.parent_id));

                        callback();
                    }
                )
            },
            // Get count comments by Emoji
            (callback) => {
                rest.post('/v1/comments/get_count_comments_by_emoji',
                    {
                        content: '😀'.codePointAt(0).toString(10),
                        parent_id: '34'
                    },
                    (err, req, res, count_comments) => {

                        let comment1 = count_comments.comments[0];
                        let comment2 = count_comments.comments[1];
                        
                        assert.isNull(err);
                        assert.equal(count_comments.count, 2);
                        assert.equal(comment1.content, comment2.content);
                        assert.equal(comment1.parent_id, comment2.parent_id);
                        callback();
                    }
                )
            },
            // Delete the comment
            (callback) => {
                rest.post('/v1/comments/delete_comment_by_id',
                    {
                        comment_id: comment1.id
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment1.id, comment.id);

                        callback();
                    }
                )
            },
            // Try to get deleted comment
            (callback) => {
                rest.post('/v1/comments/get_comment_by_id',
                    {
                        comment_id: comment1.id
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);

                        assert.isEmpty(comment || null);

                        callback();
                    }
                )
            }
        ], done);
    });

    test('Test likes/dislikes/reports', (done) => {

        let comment1: CommentV1;

        async.series([
            // Create the first comment
            (callback) => {
                rest.post('/v1/comments/create_comment',
                    {
                        comment: COMMENT1
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);
                        assert.isObject(comment);
                        assert.equal(COMMENT1.parent_id, comment.parent_id);
                        assert.equal(COMMENT1.content, comment.content);
                        assert.equal(COMMENT1.author_id, comment.author_id);
                        // assert.equal(COMMENT1.create_time.toUTCString(), comment.create_time.toUTCString());
                        assert.equal(COMMENT1.like_count, comment.like_count);
                        assert.equal(COMMENT1.dislike_count, comment.dislike_count);

                        callback();
                    }
                );
            },
            // Set one like
            (callback) => {
                rest.post('/v1/comments/like_comment',
                    {
                        comment: COMMENT1
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.like_count, COMMENT1.like_count + 1);

                        callback();
                    }
                )
            },
             // Set one dislike
            (callback) => {
                rest.post('/v1/comments/dislike_comment',
                    {
                        comment: COMMENT1
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.dislike_count, COMMENT1.dislike_count + 1);

                        callback();
                    }
                )
            },
            // Send one report
            (callback) => {
                rest.post('/v1/comments/report_comment',
                    {
                        comment: COMMENT1
                    },
                    (err, req, res, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment.report_count, COMMENT1.report_count + 1);

                        callback();
                    }
                )
            },
        ], done);
    });

});