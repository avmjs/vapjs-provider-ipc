# User Guide

All information for developers using `ethjs-provider-ipc` should consult this document.

## Install

```
npm install --save ethjs-provider-ipc
```

## Usage

```js
const IpcProvider = require('ethjs-provider-ipc');
const Eth = require('ethjs-query');
const eth = new Eth(new IpcProvider('/var/run/geth.ipc'));

eth.getBlockByNumber(45039930, cb);

// result null { hash: 0x.. etc.. }
});
```

## API Design

### constructor

[index.js:ethjs-provider-ipc](../../../blob/master/src/index.js "Source code on GitHub")

Intakes a `provider` path specified as a string, outputs a web3 standard `IpcProvider` object.

**Parameters**

-   `provider` **String** the path to your local unis socket RPC enabled Ethereum node (e.g. `/var/run/geth.ipc`).

Result `IpcProvider` **Object**.

```js
const IpcProvider = require('ethjs-provider-ipc');
const Eth = require('ethjs-query');
const eth = new Eth(new IpcProvider('/var/run/geth.ipc'));

eth.accounts((err, result) => {
  // result null ['0xd89b8a74c153f0626497bc4a531f702...', ...]
});
```

## Latest Webpack Figures

```

Hash: 19a6a35da5b5795d31b4                                                         
Version: webpack 2.1.0-beta.15
Time: 777ms
                     Asset     Size  Chunks             Chunk Names
    ethjs-provider-ipc.js  5.43 kB       0  [emitted]  main
ethjs-provider-ipc.js.map   6.1 kB       0  [emitted]  main
   [2] multi main 28 bytes {0} [built]
    + 2 hidden modules

Hash: 04c4c298f25fbf6d2da8                                                         
Version: webpack 2.1.0-beta.15
Time: 733ms
                     Asset     Size  Chunks             Chunk Names
ethjs-provider-ipc.min.js  2.11 kB       0  [emitted]  main
   [2] multi main 28 bytes {0} [built]
    + 2 hidden modules
```

## Other Awesome Modules, Tools and Frameworks

### Foundation
 - [web3.js](https://github.com/ethereum/web3.js) -- the original Ethereum JS swiss army knife **Ethereum Foundation**
 - [ethereumjs](https://github.com/ethereumjs) -- critical ethereum javascript infrastructure **Ethereum Foundation**
 - [browser-solidity](https://ethereum.github.io/browser-solidity) -- an in browser Solidity IDE **Ethereum Foundation**

### Nodes
  - [geth](https://github.com/ethereum/go-ethereum) Go-Ethereum
  - [parity](https://github.com/ethcore/parity) Rust-Ethereum build in Rust
  - [testrpc](https://github.com/ethereumjs/testrpc) Testing Node (ethereumjs-vm)

### Testing
 - [wafr](https://github.com/silentcicero/wafr) -- a super simple Solidity testing framework
 - [truffle](https://github.com/ConsenSys/truffle) -- a solidity/js dApp framework
 - [embark](https://github.com/iurimatias/embark-framework) -- a solidity/js dApp framework
 - [dapple](https://github.com/nexusdev/dapple) -- a solidity dApp framework
 - [chaitherium](https://github.com/SafeMarket/chaithereum) -- a JS web3 unit testing framework
 - [contest](https://github.com/DigixGlobal/contest) -- a JS testing framework for contracts

### Wallets
 - [ethers-wallet](https://github.com/ethers-io/ethers-wallet) -- an amazingly small Ethereum wallet
 - [metamask](https://metamask.io/) -- turns your browser into an Ethereum enabled browser =D

## Our Relationship with Ethereum & EthereumJS

 We would like to mention that we are not in any way affiliated with the Ethereum Foundation or `ethereumjs`. However, we love the work they do and work with them often to make Ethereum great! Our aim is to support the Ethereum ecosystem with a policy of diversity, modularity, simplicity, transparency, clarity, optimization and extensibility.

 Many of our modules use code from `web3.js` and the `ethereumjs-` repositories. We thank the authors where we can in the relevant repositories. We use their code carefully, and make sure all test coverage is ported over and where possible, expanded on.
