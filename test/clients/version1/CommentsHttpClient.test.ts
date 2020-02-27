import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { CommentsMemoryPersistence } from '../../../src/persistence/CommentsMemoryPersistence';
import { CommentsController } from '../../../src/logic/CommentsController';
import { CommentsHttpServiceV1 } from '../../../src/services/version1/CommentsHttpServiceV1';
import { CommentsHttpClientV1 } from '../../../src/clients/version1/CommentsHttpClientV1';
import { CommentsClientV1Fixture } from './CommentsClientV1Fixture';

suite('CommentsHttpClientV1', () => {
    let persistence: CommentsMemoryPersistence;
    let controller: CommentsController;
    let service: CommentsHttpServiceV1;
    let client: CommentsHttpClientV1;
    let fixture: CommentsClientV1Fixture;

    setup((done) => {
        persistence = new CommentsMemoryPersistence();
        persistence.configure(new ConfigParams());

        controller = new CommentsController();
        controller.configure(new ConfigParams());

        let httpConfig = ConfigParams.fromTuples(
            'connection.protocol', 'http',
            'connection.port', 3000,
            'connection.host', 'localhost'
        );

        service = new CommentsHttpServiceV1();
        service.configure(httpConfig);

        client = new CommentsHttpClientV1();
        client.configure(httpConfig);

        let references = References.fromTuples(
            new Descriptor('comments', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('comments', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('comments', 'service', 'http', 'default', '1.0'), service,
            new Descriptor('comments', 'client', 'http', 'default', '1.0'), client
        );
        controller.setReferences(references);
        service.setReferences(references);
        client.setReferences(references);

        fixture = new CommentsClientV1Fixture(client);

        persistence.open(null, (err) => {
            if (err) {
                done(err);
                return;
            }

            service.open(null, (err) => {
                if (err) {
                    done(err);
                    return;
                }

                client.open(null, done);
            });
        });
    });

    teardown((done) => {
        client.close(null, (err) => {
            service.close(null, (err) => {
                persistence.close(null, done);
            });    
        });
    });

    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Calculate Comments', (done) => {
        fixture.testCalculateComments(done);
    });

    test('Test likes/dislikes/reports comment', (done) => {
        fixture.testLikesDislikesReports(done);
    });
});