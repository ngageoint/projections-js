# Projections Javascript

#### Projections Lib ####

The Projections Library was developed at the [National Geospatial-Intelligence Agency (NGA)](http://www.nga.mil/) in collaboration with [BIT Systems](https://www.caci.com/bit-systems/). The government has "unlimited rights" and is releasing this software to increase the impact of government investments by providing developers with the opportunity to take things in new directions. The software use, modification, and distribution rights are stipulated within the [MIT license](http://choosealicense.com/licenses/mit/).

### Pull Requests ###
If you'd like to contribute to this project, please make a pull request. We'll review the pull request and discuss the changes. All pull request contributions to this project will be released under the MIT license.

Software source code previously released under an open source license and then modified by NGA staff is considered a "joint work" (see 17 USC § 101); it is partially copyrighted, partially public domain, and as a whole is protected by the copyrights of the non-government authors and must be released according to the terms of the original open source license.

### About ###

[Projections](http://ngageoint.github.io/projections-js/) is a Javascript library for performing projection conversions between coordinates.

### Usage ###

View the latest [JS Docs](http://ngageoint.github.io/projections-js)



#### Browser Usage ####
```html
<script src="/path/to/projections-js/dist/projections.min.js"></script>
```
```javascript
const { Projections, ProjectionConstants } = window.Projections;

const x = 22.0;
const y = 33.0;
const projection1 = Projections.getProjection(ProjectionConstants.AUTHORITY_EPSG, ProjectionConstants.EPSG_WEB_MERCATOR);
const projection2 = Projections.getProjectionForName("EPSG:4326");
const transform = Projections.getProjectionTransformation(projection1, projection2);
const transformed1 = transform.transform(x, y); // [x, y]
const transformed2 = transform.transformCoordinateArray([x, y]); // [x, y]
const transformed3 = transform.transformCoordinate({x, y}); // {x, y}
```

#### Node Usage ####
[![NPM](https://img.shields.io/npm/v/@ngageoint/projections-js.svg)](https://www.npmjs.com/package/@ngageoint/projections-js)

Pull from [NPM](https://www.npmjs.com/package/@ngageoint/projections-js)

```install
npm install --save projections-js
```
```javascript
const { Projections, ProjectionConstants } = require("@ngageoint/projections-js");

const x = 22.0;
const y = 33.0;
const projection1 = Projections.getProjection(ProjectionConstants.AUTHORITY_EPSG, ProjectionConstants.EPSG_WEB_MERCATOR);
const projection2 = Projections.getProjectionForName("EPSG:4326");
const transform = Projections.getProjectionTransformation(projection1, projection2);
const transformed1 = transform.transform(x, y); // [x, y]
const transformed2 = transform.transformCoordinateArray([x, y]); // [x, y]
const transformed3 = transform.transformCoordinate({x, y}); // {x, y}
```

### Build ###

![Build & Test](https://github.com/ngageoint/projections-js/actions/workflows/run-tests.yml/badge.svg)

Build this repository using Node.js:

    npm install
    npm run build
