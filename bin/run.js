let CommentsProcess = require('../obj/src/container/CommentsProcess').CommentsProcess;

try {
    let proc = new CommentsProcess();
    proc._configPath = "./config/config.yml";
    proc.run(process.argv);
} catch (ex) {
    console.error(ex);
}