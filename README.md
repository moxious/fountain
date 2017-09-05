# fountain

This project is generated from the [node-typescript-seed](https://github.com/UIUXEngineering/node-typescript-seed).

# Table of Contents
- [Install](#install)
- [API](#api)
- [TypeScript Usage](#typescript-usage)
- [ES6 Usage](#es6-usage)
- [CommonJS Usage](#commonjs-usage)
- [UMD Usage](#umd-usage)
- [Contribute](#contribute)
- [Report Issues](#report-issues)

# Install

Install using npm or yarn.

```bash
    yarn add fountain
```

# API
TODO - document your api here

## feature
### Return Data Type
### Coniguration params

```typescript

    // How to use

```

## feature
### Return Data Type
### Coniguration params


```typescript

    // How to use

```

# TypeScript Usage

Import from index.ts

```typescript

    // import index.ts
    import 'fountain';
    
    // or import feature
    
    import { someFeature } from 'fountain';
    
    // or import feature file directly
    
    import * as someFeature from 'fountain/[path/to/feature/file]'

```

# ES6 Usage

Import features from the `dist/es6` directory. You may import a file directly from the `dist/es6` directory.

```javascript 1.6

    import 'fountain/dist/es6/index';
    
    // or import feature
        
    import { someFeature } from 'fountain';
    
    // or import feature file directly
    
    import * as someFeature from 'fountain/[path/to/feature/file]'

```

# CommonJS Usage

Import features from the `dist/cjs` directory. You may import a file directly from the `dist/es6` directory.

```javascript

    var someFeature = require('fountain/dist/cjs');
    
    // or
    
    var someFeature = require('fountain/dist/cjs/[path/to/feature/file]');

```

# UMD Usage

Import using either method above, or using `define`:

```javascript

    define(['node_modules/fountain/dist/umd'], function(dep1) {
        // do stuff with module
    });
    
    // or 
    
    define(['node_modules/fountain/dist/umd/[feature filename]'], function(dep1) {
        // do stuff with module
    });

```

# Contribute

To contribute, see the [project repo](https://github.com/moxious/fountain.git).
See [docs/PROJECT_README.md](docs/PROJECT_README.md) for development guide.


# Report Issues

Report issues to project [issue queue](https://github.com/moxious/fountain/issues);
