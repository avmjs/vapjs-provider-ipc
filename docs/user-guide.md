# User Guide

All information for developers using `vapjs-provider-ipc` should consult this document.

## Install

```
npm install --save vapjs-provider-ipc
```

## Usage

```js
const IpcProvider = require('vapjs-provider-ipc');
const Vap = require('vapjs-query');
const vap = new Vap(new IpcProvider('/var/run/gvap.ipc'));

vap.getBlockByNumber(45039930, cb);

// result null { hash: 0x.. etc.. }
});
```

## API Design

### constructor

[index.js:vapjs-provider-ipc](../../../blob/master/src/index.js "Source code on GitHub")

Intakes a `provider` path specified as a string, outputs a web3 standard `IpcProvider` object.

**Parameters**

-   `provider` **String** the path to your local unis socket RPC enabled Vapory node (e.g. `/var/run/gvap.ipc`).

Result `IpcProvider` **Object**.

```js
const IpcProvider = require('vapjs-provider-ipc');
const Vap = require('vapjs-query');
const vap = new Vap(new IpcProvider('/var/run/gvap.ipc'));

vap.accounts((err, result) => {
  // result null ['0xd89b8a74c153f0626497bc4a531f702...', ...]
});
```

## Latest Webpack Figures

```

Hash: 19a6a35da5b5795d31b4                                                         
Version: webpack 2.1.0-beta.15
Time: 777ms
                     Asset     Size  Chunks             Chunk Names
    vapjs-provider-ipc.js  5.43 kB       0  [emitted]  main
vapjs-provider-ipc.js.map   6.1 kB       0  [emitted]  main
   [2] multi main 28 bytes {0} [built]
    + 2 hidden modules

Hash: 04c4c298f25fbf6d2da8                                                         
Version: webpack 2.1.0-beta.15
Time: 733ms
                     Asset     Size  Chunks             Chunk Names
vapjs-provider-ipc.min.js  2.11 kB       0  [emitted]  main
   [2] multi main 28 bytes {0} [built]
    + 2 hidden modules
```

## Other Awesome Modules, Tools and Frameworks

### Foundation
 - [web3.js](https://github.com/vaporyco/web3.js) -- the original Vapory JS swiss army knife **Vapory Foundation**
 - [vaporyjs](https://github.com/vaporycojs) -- critical vapory javascript infrastructure **Vapory Foundation**
 - [browser-solidity](https://vapory.github.io/browser-solidity) -- an in browser Solidity IDE **Vapory Foundation**

### Nodes
  - [gvap](https://github.com/vaporyco/go-vapory) Go-Vapory
  - [parity](https://github.com/ethcore/parity) Rust-Vapory build in Rust
  - [testrpc](https://github.com/vaporycojs/testrpc) Testing Node (vaporyjs-vm)

### Testing
 - [wafr](https://github.com/silentcicero/wafr) -- a super simple Solidity testing framework
 - [truffle](https://github.com/ConsenSys/truffle) -- a solidity/js dApp framework
 - [embark](https://github.com/iurimatias/embark-framework) -- a solidity/js dApp framework
 - [dapple](https://github.com/nexusdev/dapple) -- a solidity dApp framework
 - [chaitherium](https://github.com/SafeMarket/chaithereum) -- a JS web3 unit testing framework
 - [contest](https://github.com/DigixGlobal/contest) -- a JS testing framework for contracts

### Wallets
 - [ethers-wallet](https://github.com/ethers-io/ethers-wallet) -- an amazingly small Vapory wallet
 - [metamask](https://metamask.io/) -- turns your browser into an Vapory enabled browser =D

## Our Relationship with Vapory & VaporyJS

 We would like to mention that we are not in any way affiliated with the Vapory Foundation or `vaporyjs`. However, we love the work they do and work with them often to make Vapory great! Our aim is to support the Vapory ecosystem with a policy of diversity, modularity, simplicity, transparency, clarity, optimization and extensibility.

 Many of our modules use code from `web3.js` and the `vaporyjs-` repositories. We thank the authors where we can in the relevant repositories. We use their code carefully, and make sure all test coverage is ported over and where possible, expanded on.
