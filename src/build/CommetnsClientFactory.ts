import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { CommentsNullClientV1 } from '../../src/clients/version1/CommentsNullClientV1';
import { CommentsDirectClientV1 } from '../../src/clients/version1/CommentsDirectClientV1';
import { CommentsHttpClientV1 } from '../../src/clients/version1/CommentsHttpClientV1';

export class CommentsClientFactory extends Factory{
    public static NullClientDescriptor = new Descriptor('comments', 'client', 'null', '*', '1.0');
    public static DirectClientDescriptor = new Descriptor('comments', 'client', 'direct', '*', '1.0');
    public static HttpClientDescriptor = new Descriptor('comments', 'client', 'http', '*', '1.0');
    
    constructor(){
        super();

        this.registerAsType(CommentsClientFactory.NullClientDescriptor, CommentsNullClientV1);
        this.registerAsType(CommentsClientFactory.DirectClientDescriptor, CommentsDirectClientV1);
        this.registerAsType(CommentsClientFactory.HttpClientDescriptor, CommentsHttpClientV1);
    }
}