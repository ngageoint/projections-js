const should = require('chai').should();
import { ProjectionConstants, Projections } from "../lib/internal";


function testTransform (x, y) {
// ProjCoordinate coordinate = ...

	const projection1 = Projections.getProjection(ProjectionConstants.AUTHORITY_EPSG, ProjectionConstants.EPSG_WEB_MERCATOR);
	const projection2 = Projections.getProjectionForName("EPSG:4326");

	const transform = Projections.getProjectionTransformation(projection1, projection2);
	const inverseTransform = transform.getInverseTransformation();

	const transformed = transform.transform(x, y);
	const inverseTransformed = inverseTransform.transform(transformed[0], transformed[1]);

	return transformed;
}

describe('Readme Tests', function () {
	it('testTransform', function () {
		const transformed = testTransform(111319.49079327357, 111325.14286638486);
		const epsilon = .0000000000001;
		transformed[0].should.be.lt(1.0 + epsilon)
		transformed[0].should.be.gt(1.0 - epsilon)
		transformed[1].should.be.lt(1.0 + epsilon)
		transformed[1].should.be.gt(1.0 - epsilon)
	});
});
