
import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { CommentsMemoryPersistence } from '../../../src/persistence/CommentsMemoryPersistence';
import { CommentsController } from '../../../src/logic/CommentsController';
import { CommentsDirectClientV1 } from '../../../src/clients/version1/CommentsDirectClientV1';
import { CommentsClientV1Fixture } from './CommentsClientV1Fixture';

suite('CommentsDirectClientV1', () => {
    let persistence: CommentsMemoryPersistence;
    let controller: CommentsController;
    let client: CommentsDirectClientV1;
    let fixture: CommentsClientV1Fixture;

    setup((done) => {
        persistence = new CommentsMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new CommentsController();
        controller.configure(new ConfigParams());

        client = new CommentsDirectClientV1();

        let references = References.fromTuples(
            new Descriptor('comments', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('comments', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('comments', 'client', 'direct', 'default', '1.0'), client
        );

        controller.setReferences(references);
        client.setReferences(references);

        fixture = new CommentsClientV1Fixture(client);

        persistence.open(null, done);
    });

    teardown((done) => {
        persistence.close(null, done);
    });

    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Calculate Positions', (done) => {
        fixture.testCalculatePosition(done);
    });
});