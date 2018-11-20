/**
 * @original-authors:
 *   Marek Kotewicz <marek@ethdev.com>
 *   Marian Oancea <marian@ethdev.com>
 *   Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */
const net = require('net');
/**
 * InvalidResponseError helper for invalid errors.
 */
function invalidResponseError(result, host) {
  const message = !!result && !!result.error && !!result.error.message ? `[ethjs-provider-ipc] ${result.error.message}` : `[ethjs-provider-ipc] Invalid JSON RPC response from host provider ${host}: ${JSON.stringify(result, null, 2)}`;
  return new Error(message);
}

/**
 * IpcProvider should be used to send rpc calls over UNIX sockets.
 */
function IpcProvider(path) {
  if (!(this instanceof IpcProvider)) { throw new Error('[ethjs-provider-ipc] the IpcProvider instance requires the "new" flag in order to function normally (e.g. `const eth = new Eth(new IpcProvider());`).'); }
  if (typeof path !== 'string') { throw new Error('[ethjs-provider-ipc] the IpcProvider instance requires that the path be specified (e.g. `/var/run/geth.ipc`)'); }

  const self = this;
  self.path = path;
  self.responseCallbacks = {};
}

/**
 * Should be used to make async request
 *
 * @method sendAsync
 * @param {Object} payload
 * @param {Function} callback triggered on end with (err, result)
 */
IpcProvider.prototype.sendAsync = function (payload, callback) { // eslint-disable-line
  const self = this;

  try {
    if (!self.connection || !self.connection.writeable) {
      self.connection = net.connect(this.path);
    }
  } catch (error) {
    callback(new Error(`[ethjs-provider-ipc] CONNECTION ERROR: Couldn't connect to path '${self.path}': ${JSON.stringify(error, null, 2)}`), null);
  }

  self.connection.on('error', e => {
    console.error('IPC Connection Error', e); // eslint-disable-line
    callback(new Error('[ethjs-provider-ipc] CONNECTION TIMEOUT: request timeout. (i.e. your connect has timed out for whatever reason, check your provider).'), null);
  });

  self.connection.on('end', e => {
    console.error('IPC Connection Closed', e); // eslint-disable-line
    callback(new Error('[ethjs-provider-ipc] CONNECTION TIMEOUT: request timeout. (i.e. your connect has timed out for whatever reason, check your provider).'), null);
  });

  self.connection.on('data', data => {
    let result = null;
    try {
      result = JSON.parse(data);
      let id = null;

      if (Array.isArray(result)) {
        result.forEach(load => {
          if (self.responseCallbacks[load.id]) {
            id = load.id;
          }
        });
      } else {
        id = result.id;
      }

      if (self.responseCallbacks[id]) {
        self.responseCallbacks[id](null, result);
        delete self.responseCallbacks[id];
      }
    } catch (jsonError) {
      callback(invalidResponseError(data, self.path), null);
    }
  });

  const id = payload.id || payload[0].id;
  self.responseCallbacks[id] = callback;

  self.connection.write(JSON.stringify(payload));
};

module.exports = IpcProvider;
