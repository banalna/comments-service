import { Schema } from 'mongoose';
let Mixed = Schema.Types.Mixed;

export let CommentsMongoDbSchema = function(collection?: string) {
    collection = collection || 'comments';

    let schema = new Schema(
        {
            _id: {type: String}, 
            parent_id: {type: String, required: true},
            content: {type: String, required: true},
            author_id: {type: String, required: true},
            create_time: {type: String, required: true},
            update_time: {type: String, required: false},
            like_count: {type: Number, required: true},
            dislike_count: {type: Number, required: true},
            type: {type: String, required: false},
            archive_time: {type: String, required: false}
        },
        {
            collection: collection,
            autiIndex: true
        }
    );

    schema.set('toJSON', {
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    return schema;
}