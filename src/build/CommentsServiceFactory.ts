import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { CommentsMemoryPersistence } from '../../src/persistence/CommentsMemoryPersistence';
import { CommentsFilePersistence } from '../../src/persistence/CommentsFilePersistence';
import { CommentsMongoDbPersistence } from '../../src/persistence/CommentsMongoDbPersistence';
import { CommentsController } from '../../src/logic/CommentsController';
import { CommentsHttpServiceV1 } from '../../src/services/version1/CommentsHttpServiceV1';

export class CommentsServiceFactory extends Factory{
    public static MemoryPersistenceDescriptor = new Descriptor('comments', 'persistence', 'memory', '*', '1.0');
    public static FilePersistenceDescriptor = new Descriptor('comments', 'persistence', 'file', '*', '1.0');
    public static MongoDbPersistenceDescriptor = new Descriptor('comments', 'persistence', 'mongodb', '*', '1.0');
    public static ControllerDescriptor = new Descriptor('comments', 'controller', 'default', '*', '1.0');
    public static HttpServiceV1Descriptor = new Descriptor('comments', 'service', 'http', '*', '1.0');
    
    constructor(){
        super();

        this.registerAsType(CommentsServiceFactory.MemoryPersistenceDescriptor, CommentsMemoryPersistence);
        this.registerAsType(CommentsServiceFactory.FilePersistenceDescriptor, CommentsFilePersistence);
        this.registerAsType(CommentsServiceFactory.MongoDbPersistenceDescriptor, CommentsMongoDbPersistence);
        this.registerAsType(CommentsServiceFactory.ControllerDescriptor, CommentsController);
        this.registerAsType(CommentsServiceFactory.HttpServiceV1Descriptor, CommentsHttpServiceV1);
    }
}