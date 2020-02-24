import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import {CommentsServiceFactory} from '../build/CommentsServiceFactory';

export class CommentsProcess extends ProcessContainer{
    public constructor(){
        super('comments', 'Comments microservice');

        this._factories.add(new CommentsServiceFactory());
        this._factories.add(new DefaultRpcFactory());
    }
}