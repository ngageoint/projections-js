const should = require('chai').should();
import { ProjectionConstants, Projections } from "../lib/internal";

describe('Projections Tests', function () {
	const authority = "Test";
	const code = 100001;

	beforeEach(function () {
		Projections.clearCache();
	})

	it('test Projections', function () {
		should.exist(Projections.getWGS84Projection());
		Projections.getWGS84Projection().getAuthority().should.be.equal(ProjectionConstants.AUTHORITY_EPSG);
		Projections.getWGS84Projection().getCode().should.be.equal(ProjectionConstants.EPSG_WORLD_GEODETIC_SYSTEM.toString());
		Projections.isWGS84("urn:ogc:def:crs:EPSG::4326").should.be.true;
		Projections.getCode("urn:ogc:def:crs:EPSG::4326").should.be.equal("4326");
		Projections.getWGS84Projection().equalsProjection(Projections.getProjectionForName("urn:ogc:def:crs:EPSG::4326")).should.be.true;
		should.exist(Projections.getWebMercatorProjection());
		Projections.getWebMercatorProjection().getAuthority().should.be.equal(ProjectionConstants.AUTHORITY_EPSG);
		Projections.getWebMercatorProjection().getCode().should.be.equal(ProjectionConstants.EPSG_WEB_MERCATOR.toString());
		Projections.isWebMercator("urn:ogc:def:crs:EPSG::3857").should.be.true;
		Projections.getUnits("urn:ogc:def:crs:EPSG::3857").should.be.equal("m");
		Projections.getUnits("urn:ogc:def:crs:EPSG::4326").should.be.equal("degrees");
		Projections.getUnits("urn:ogc:def:crs:OGC::CRS84").should.be.equal("degrees");
		should.exist(Projections.getCRS84Projection());
		Projections.getCRS84Projection().equalsProjection(Projections.getProjectionForName("CRS84"));
		Projections.getCRS84Projection().equalsProjection(Projections.getProjectionForName("urn:ogc:def:crs:OGC::CRS84"));
		Projections.getCRS84Projection().equalsProjection(Projections.getProjectionForName("OGC:CRS84"));

		should.not.exist(Projections.getMetersPerUnit("urn:ogc:def:crs:EPSG::3857"));
		should.not.exist(Projections.getMetersPerUnit("urn:ogc:def:crs:EPSG::4326"));
		should.not.exist(Projections.getMetersPerUnit("urn:ogc:def:crs:OGC::CRS84"));

		Projections.clearCache(ProjectionConstants.AUTHORITY_EPSG);

		try {
			Projections.getProjectionForName("urn:ogc:def:crs:EPSG:1.2:hello:4326");
			should.fail("Invalid projection did not fail");
		} catch (e) {
			// pass
		}
	});

	it('test transforming points', function () {
		const transform = Projections.getWGS84Projection().getTransformation(Projections.getWebMercatorProjection());
		const transformedPt1 = transform.transform(22.0, 33.0);
		const transformedPt2 = transform.transformCoordinate({x: 22.0, y: 33.0});
		const transformedPt3 = transform.transformCoordinateArray([22.0, 33.0]);

		transformedPt2.x.should.be.equal(transformedPt1[0]);
		transformedPt2.y.should.be.equal(transformedPt3[1]);
	});

	it('test transforming bounds', function () {
		const transform = Projections.getWGS84Projection().getTransformation(Projections.getWebMercatorProjection());
		const boundsA = transform.transformBounds(-180, -90, 180, 90);
		should.exist(boundsA);
		const boundsB = transform.transformBounds(-185, -95, 185, 95);
		boundsA[0].should.be.equal(boundsB[0]);
		boundsA[1].should.be.equal(boundsB[1]);
		boundsA[2].should.be.equal(boundsB[2]);
		boundsA[3].should.be.equal(boundsB[3]);

		const transformSameProjections = Projections.getWGS84Projection().getTransformation(Projections.getWGS84Projection());
		const bounds = transformSameProjections.transformBounds(-180, -90, 180, 90);
		bounds[0].should.be.equal(-180);
		bounds[1].should.be.equal(-90);
		bounds[2].should.be.equal(180);
		bounds[3].should.be.equal(90);

		transformSameProjections.getFromProjection().equalsProjection(transformSameProjections.getToProjection()).should.be.true;

		should.exist(transformSameProjections.getConverter());
	});

	it('test custom projections', function () {
		let authorityCode = code;

		const projection = Projections.getProjection(authority, authorityCode.toString(), "+proj=tmerc +lat_0=0 +lon_0=121 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs");
		authorityCode++;

		should.exist(projection);

		const params = [ "+proj=tmerc", "+lat_0=0",
			"+lon_0=121", "+k=1", "+x_0=500000", "+y_0=0", "+ellps=krass",
			"+units=m", "+no_defs"];
		const projection2 = Projections.getProjection(authority, authorityCode.toString(), params.join(" "));
		authorityCode++;
		should.exist(projection2);

		try {
			Projections.getProjection(authority, authorityCode.toString(), "+proj=tmerc +lat_0=0 +lon_0=121 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs +invalid");
			authorityCode++;
			should.fail("Invalid projection did not fail");
		} catch (e) {
			// pass
		}

		try {
			const params2 =  [ "+proj=tmerc", "+lat_0=0",
				"+lon_0=121", "+k=1", "+x_0=500000", "+y_0=0", "+ellps=krass",
				"+units=m", "+no_defs"];
			params2.push("+invalid");
			Projections.getProjection(authority, authorityCode.toString(), params2.join(" "));
			authorityCode++;
			should.fail("Invalid projection did not fail");
		} catch (e) {
			// pass
		}

		try {
			Projections.getProjection(authority, authorityCode.toString());
			should.fail("Invalid projection did not fail");
		} catch (e) {
			// pass
		}
  });

	/**
	 * Test adding a projection to an authority
	 */
	it('adding projection to authority', function () {
		try {
			Projections.getProjection(ProjectionConstants.AUTHORITY_NONE, code);
			should.fail("Missing projection did not fail");
		} catch (e) {
			// pass
		}
		const projection = Projections.getProjection(ProjectionConstants.AUTHORITY_NONE, code, "+proj=tmerc +lat_0=0 +lon_0=121 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs");
		should.exist(projection);
	});

	/**
	 * Test adding projections to an authority
	 */
	it('adding authority projections', function () {

		// Make sure 4 projections do not exist
		for (let i = code; i < code + 4; i++) {
			try {
				Projections.getProjection(authority, i);
				should.fail("Missing projection did not fail");
			} catch (e) {
				// pass
			}
		}

		// Add 3 custom projections to the new authority
		const properties = {};
		properties[code.toString()] = "+proj=tmerc +lat_0=0 +lon_0=121 +k=1 +x_0=500000 +y_0=0 +ellps=krass +units=m +no_defs";
		properties[(code + 1).toString()] = "+proj=longlat +datum=WGS84 +no_defs";
		properties[(code + 2).toString()] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";
		Projections.setProjections(authority, properties);

		// Verify first 3 projections exist, last still does not
		for (let i = code; i < code + 4; i++) {
			if (i < code + 3) {
				const projection = Projections.getProjection(authority, i);
				projection.getAuthority().should.be.equal(authority);
				projection.getCode().should.be.equal(i.toString());
				should.exist(projection.getTransformationTo(authority, code));
				should.exist(projection.getInverseTransformationTo(authority, code));
				should.exist(projection.getTransformation(Projections.getProjection(authority, code)));
				should.exist(projection.getInverseTransformation(Projections.getProjection(authority, code)));
				if (i > code) {
					Projections.getProjection(authority, code).equals(authority, i.toString()).should.be.false;
				}
				Projections.getProjection(authority, i).equalsProjection(projection).should.be.true;
				projection.toString().should.be.equal(authority + ':' + i);
				should.exist(projection);
			} else {
				try {
					Projections.getProjection(authority, i);
					should.fail("Missing projection did not fail");
				} catch (e) {
					// pass
				}
			}
		}

		// Clear authority code from factory cache and verify no longer exists
		Projections.clear(authority, code);
		try {
			Projections.getProjection(authority, code);
			should.fail("Missing projection did not fail");
		} catch (e) {
			// pass
		}

		// Set projection back into the retriever and verify factory creates it
		Projections.setProjection(authority, code, "+proj=longlat +datum=WGS84 +no_defs");
		const projection = Projections.getProjection(authority, code);
		should.exist(projection);

	});
});
