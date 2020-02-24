import { CommandableHttpService } from 'pip-services3-rpc-node';
import { Descriptor } from 'pip-services3-commons-node';

export class CommentsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/comments');
        this._dependencyResolver.put('controller', new Descriptor('comments', 'controller', '*', '*', '1.0'));
    }
}