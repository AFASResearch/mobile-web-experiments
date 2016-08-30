process.argv = ['node', 'hz', 'serve', '--dev', '--port', process.env.PORT];
require('horizon/src/main');
