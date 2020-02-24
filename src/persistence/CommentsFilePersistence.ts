import { JsonFilePersister } from 'pip-services3-data-node';

import { CommentV1 } from '../data/version1/CommentV1';
import { CommentsMemoryPersistence } from './CommentsMemoryPersistence';
import { ConfigParams } from 'pip-services3-commons-node';

export class CommentsFilePersistence extends CommentsMemoryPersistence {
    protected _persister: JsonFilePersister<CommentV1>;

    constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<CommentV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams) {
        super.configure(config);
        this._persister.configure(config);
    }
    
}