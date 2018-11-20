const IpcProvider = require('../index.js'); // eslint-disable-line
const TestRPC = require('ethereumjs-testrpc'); // eslint-disable-line
const Eth = require('ethjs-query'); // eslint-disable-line
const EthQuery = require('eth-query');
const Web3 = require('web3');
const assert = require('chai').assert; // eslint-disable-line
const SandboxedModule = require('sandboxed-module');
const server = TestRPC.server();
server.listen(5002);

const net = require('net');
const http = require('http');

const socketServer = net.createServer(socket => {
  socket.on('data', data => {
    const request = data.toString('utf8');

    const httprequest = http.request({ method: 'post', port: 5002, path: '/' }, response => {
      let body = '';
      response.on('data', d => {
        body += d;
      });
      response.on('end', () => {
        socket.write(body);
      });
      response.on('error', (e) => {
        console.error(`problem with request: ${e.message}`); // eslint-disable-line
      });
    });
    httprequest.write(request);
    httprequest.end();
  });

  socket.on('close', () => {
    socket.end();
    socket.destroy();
  });
});

socketServer.listen('/tmp/out.ipc');
after(() => socketServer.close());

function FakeNet() {
}

FakeNet.connect = function(path) { // eslint-disable-line
  const self = this;
  self.path = path;
  return self;
};

FakeNet.write = function (payload) { // eslint-disable-line
  const payloadParsed = JSON.parse(payload);

  if (payloadParsed.forceTimeout === true) {
    netCallbacks.error(new Error('Timeout reached'));
  } else if (payloadParsed.invalidSend === true) {
    netCallbacks.error(new Error('Invalid data sent'));
  } else if (payloadParsed.invalidJSON === true) {
    netCallbacks.error(new Error('Invalid JSON'));
  } else {
    netCallbacks.data(payload);
  }
};

const netCallbacks = {};
FakeNet.on = function(type, callback) { // eslint-disable-line
  netCallbacks[type] = callback;
};

SandboxedModule.registerBuiltInSourceTransformer('istanbul');
const FakeIpcProvider = SandboxedModule.require('../index.js', {
  requires: {
    net: FakeNet,
  },
  singleOnly: true,
});

describe('IpcProvider', () => {
  describe('constructor', () => {
    it('should throw under invalid conditions', () => {
      assert.throws(() => IpcProvider(''), Error); // eslint-disable-line
      assert.throws(() => new IpcProvider({}), Error); // eslint-disable-line
    });

    it('should construct normally under valid conditions', () => {
      const provider = new IpcProvider('/tmp/out2.ipc');
      assert.equal(provider.path, '/tmp/out2.ipc');
    });

    it('should throw error with no new', () => {
      function invalidProvider() {
        IpcProvider('/tmp/out2.ipc'); // eslint-disable-line
      }
      assert.throws(invalidProvider, Error);
    });

    it('should throw error with no provider', () => {
      function invalidProvider() {
        new IpcProvider(); // eslint-disable-line
      }
      assert.throws(invalidProvider, Error);
    });
  });

  describe('test against ethjs-query', () => {
    const eth = new Eth(new IpcProvider('/tmp/out.ipc')); // eslint-disable-line

    it('should get accounts', (done) => {
      eth.accounts((accountsError, accountsResult) => {
        assert.equal(accountsError, null);
        assert.equal(typeof accountsResult, 'object');
        assert.equal(Array.isArray(accountsResult), true);

        done();
      });
    });

    it('should get balances', (done) => {
      eth.accounts((accountsError, accountsResult) => {
        assert.equal(accountsError, null);
        assert.equal(typeof accountsResult, 'object');
        assert.equal(Array.isArray(accountsResult), true);

        eth.getBalance(accountsResult[0], (balanceError, balanceResult) => {
          assert.equal(balanceError, null);
          assert.equal(typeof balanceResult, 'object');
          assert.equal(balanceResult.toNumber(10) > 0, true);

          done();
        });
      });
    });

    it('should get coinbase and balance', (done) => {
      eth.coinbase((accountsError, accountResult) => {
        assert.equal(accountsError, null);
        assert.equal(typeof accountResult, 'string');

        eth.getBalance(accountResult, (balanceError, balanceResult) => {
          assert.equal(balanceError, null);
          assert.equal(typeof balanceResult, 'object');
          assert.equal(balanceResult.toNumber(10) > 0, true);

          done();
        });
      });
    });
  });

  describe('test against eth-query', () => {
    const query = new EthQuery(new IpcProvider('/tmp/out.ipc')); // eslint-disable-line

    it('should get accounts', (done) => {
      query.accounts((accountsError, accountsResult) => {
        assert.equal(accountsError, null);
        assert.equal(typeof accountsResult, 'object');
        assert.equal(Array.isArray(accountsResult), true);

        done();
      });
    });

    it('should get balances', (done) => {
      query.accounts((accountsError, accountsResult) => {
        assert.equal(accountsError, null);
        assert.equal(typeof accountsResult, 'object');
        assert.equal(Array.isArray(accountsResult), true);

        query.getBalance(accountsResult[0], (balanceError, balanceResult) => {
          assert.equal(balanceError, null);
          assert.equal(typeof balanceResult, 'string');

          done();
        });
      });
    });

    it('should get coinbase and balance', (done) => {
      query.coinbase((accountsError, accountResult) => {
        assert.equal(accountsError, null);
        assert.equal(typeof accountResult, 'string');

        query.getBalance(accountResult, (balanceError, balanceResult) => {
          assert.equal(balanceError, null);
          assert.equal(typeof balanceResult, 'string');

          done();
        });
      });
    });
  });

  describe('test against web3', () => {
    const web3 = new Web3(new IpcProvider('/tmp/out.ipc')); // eslint-disable-line

    it('should get accounts WEB3', (done) => {
      web3.eth.getAccounts((accountsError, accountsResult) => {
        assert.equal(accountsError, null);
        assert.equal(typeof accountsResult, 'object');
        assert.equal(Array.isArray(accountsResult), true);
        done();
      });
    });

    it('should get balances', (done) => {
      web3.eth.getAccounts((accountsError, accountsResult) => {
        assert.equal(accountsError, null);
        assert.equal(typeof accountsResult, 'object');
        assert.equal(Array.isArray(accountsResult), true);

        web3.eth.getBalance(accountsResult[0], (balanceError, balanceResult) => {
          assert.equal(balanceError, null);
          assert.equal(typeof balanceResult, 'object');
          assert.equal(balanceResult.toNumber(10) > 0, true);

          done();
        });
      });
    });

    it('should get coinbase and balance', (done) => {
      web3.eth.getCoinbase((accountsError, accountResult) => {
        assert.equal(accountsError, null);
        assert.equal(typeof accountResult, 'string');

        web3.eth.getBalance(accountResult, (balanceError, balanceResult) => {
          assert.equal(balanceError, null);
          assert.equal(typeof balanceResult, 'object');
          assert.equal(balanceResult.toNumber(10) > 0, true);

          done();
        });
      });
    });

    it('should close the server', () => {
      server.close();
    });
  });

  describe('web3 FakeProvider', () => {
    describe('sendAsync timeout', () => {
      it('should send basic async request and timeout', (done) => {
        const provider = new FakeIpcProvider('/tmp/out.ipc');

        provider.sendAsync({ forceTimeout: true, id: 234 }, (err, result) => {
          assert.equal(typeof err, 'object');
          assert.equal(result, null);
          done();
        });
      });
    });

    describe('invalid payload', () => {
      it('should throw an error as its not proper json', (done) => {
        const provider = new FakeIpcProvider('/tmp/out.ipc');

        provider.sendAsync('sdfsds{}{df()', (err, result) => {
          assert.equal(typeof err, 'object');
          assert.equal(typeof result, 'object');
          done();
        });
      });

      it('should throw an error as its not proper json', (done) => {
        const provider = new FakeIpcProvider('/tmp/out.ipc');

        provider.sendAsync({ invalidSend: true, id: 333 }, (err, result) => {
          assert.equal(typeof err, 'object');
          assert.equal(typeof result, 'object');
          done();
        });
      });
    });

    describe('sendAsync timeout', () => {
      it('should send basic async request and timeout', (done) => {
        const provider = new FakeIpcProvider('/tmp/out.ipc');
        provider.sendAsync({ forceTimeout: true, id: 85 }, (err, result) => {
          assert.equal(typeof err, 'object');
          assert.equal(result, null);
          done();
        });
      });
    });

    describe('sendAsync', () => {
      it('should send basic async request', (done) => {
        const provider = new FakeIpcProvider('/tmp/out.ipc');

        provider.sendAsync({ id: 346 }, (err, result) => {
          assert.equal(typeof result, 'object');
          done();
        });
      });
    });
  });
});
