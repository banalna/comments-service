let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { CommentV1 } from '../../src/data/version1/CommentV1';
import { CommentTypeV1 } from '../../src/data/version1/CommentTypeV1';
import { CommentsMemoryPersistence } from '../../src/persistence/CommentsMemoryPersistence';
import { CommentsController } from '../../src/logic/CommentsController';


const COMMENT1: CommentV1 = {

    id: '1',
    parent_id: '34', 
    content: "😀".codePointAt(0).toString(10),
    author_id: '4545',
    create_time: new Date(Date.UTC(2020, 7, 15, 10,52,34)),
    update_time: new Date(Date.UTC(2020, 7, 17, 11,48,50)),
    like_count: 57,
    dislike_count: 0,
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


suite('CommentsController', () => {
    let persistence: CommentsMemoryPersistence;
    let controller: CommentsController;

    setup((done) => {
        persistence = new CommentsMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new CommentsController();
        controller.configure(new ConfigParams());

        let references = References.fromTuples(
            new Descriptor('comments', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('comments', 'controller', 'default', 'default', '1.0'), controller
        );

        controller.setReferences(references);

        persistence.open(null, done);
    });

    teardown((done) => {
        persistence.close(null, done);
    });

    test('CRUD Operations', (done) => {
        let comment1: CommentV1;

        async.series([
            // Create the first comment
            (callback) => {
                controller.createComment(
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
                controller.createComment(
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
                controller.createComment(
                    null,
                    COMMENT3,
                    (err, comment) => {
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
                controller.getComments(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
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
                comment1.content = 'update content test';
                comment1.update_time = new Date(Date.UTC(2025, 3, 10, 15,10,5));
                controller.updateComment(
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
                controller.getByParentId(
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
                controller.deleteCommentById(
                    null,
                    comment1.id,
                    (err, comment) => {
                        assert.isNull(err);

                        assert.isObject(comment);
                        assert.equal(comment1.id, comment.id);

                        callback();
                    }
                )
            },
            // Try to get deleted comment
            (callback) => {
                controller.getCommentById(
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
    });


    test('Get count comments by Emoji', (done) => {
        async.series([
            // Create the first comment
            (callback) => {
                controller.createComment(
                    null,
                    COMMENT1,
                    (err, comment) => {
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
                controller.createComment(
                    null,
                    COMMENT2,
                    (err, comment) => {
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
                controller.createComment(
                    null,
                    COMMENT3,
                    (err, comment) => {
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
            // Calculate count of comments for one emoji
            (callback) => {
                controller.getCountCommentsByEmoji(
                    null, "😀".codePointAt(0).toString(10), '34',
                    (err, count_comments) => {
                        
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
        ], done);
    });
});