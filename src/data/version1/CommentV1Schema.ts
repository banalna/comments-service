import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class CommentV1Schema extends ObjectSchema {

    public constructor()
    {
        super();

        this.withRequiredProperty('id', TypeCode.String);
        this.withRequiredProperty('parent_id', TypeCode.String);
        this.withRequiredProperty('content', TypeCode.String);
        this.withRequiredProperty('author_id',TypeCode.String );
        this.withRequiredProperty('create_time', null);
        this.withOptionalProperty('update_time', null);
        this.withOptionalProperty('like_count', TypeCode.Integer);
        this.withOptionalProperty('dislike_count', TypeCode.Integer);
        this.withOptionalProperty('type', TypeCode.String);
        this.withOptionalProperty('archive_time', null);
        this.withOptionalProperty('report_count', TypeCode.Integer);

    }

}