import { Projection, ProjectionConstants, ProjectionException, ProjectionTransform } from "./internal";
import proj4, { Converter, ProjectionDefinition } from "proj4";

/**
 * Retrieves the proj4 projection parameter string for an authority and coordinate code
 */
export class Projections {
	/**
	 * Projections property file name prefix
	 */
	public static readonly PROJECTIONS_PROPERTY_FILE_PREFIX = "projections";

	/**
	 * Projections property file name suffix
	 */
	public static readonly PROJECTIONS_PROPERTY_FILE_SUFFIX = "properties";

	/**
	 * Properties for each authority
	 */
	private static cachedProjections = {};

	public static getProjectionForName(name: string): Projection {
		const {authority, code} = Projections.parseAuthorityAndCode(name);
		return Projections.getProjection(authority, code);
	}

	/**
	 * Set projections for an authority. They will only be stored in the cache.
	 * @param authority
	 * @param projections
	 */
	public static setProjections(authority = ProjectionConstants.AUTHORITY_EPSG, projections) {
		if (Projections.cachedProjections[authority] == null) {
			Projections.cachedProjections[authority] = {};
		}
		Object.keys(projections).map(code => {
			const name = authority + ':' + code;
			proj4.defs(code, projections[code]);
			const definition = proj4.defs(name);
			Projections.cachedProjections[authority][code] = new Projection(authority, code, definition);
		})
	}

	/**
	 * Set projections for an authority. They will only be stored in the cache.
	 * @param authority
	 * @param code
	 * @param proj4String
	 */
	public static setProjection(authority = ProjectionConstants.AUTHORITY_EPSG, code: string | number, proj4String: string) {
		if (Projections.cachedProjections[authority] == null) {
			Projections.cachedProjections[authority] = {};
		}
		const name = authority + ':' + code;
		proj4.defs(code.toString(), proj4String);
		const definition = proj4.defs(name);
		Projections.cachedProjections[authority][code.toString()] = new Projection(authority, code.toString(), definition);
	}

	/**
	 * Get the proj4 projection string for the authority coordinate code
	 * 
	 * @param authority coordinate authority
	 * @param code coordinate code
	 * @param proj4String proj4 string
	 * @return proj4 projection
	 */
	public static getProjection(authority = ProjectionConstants.AUTHORITY_EPSG, code: string | number, proj4String: string = undefined): Projection {
		let projection: Projection;
		if (Projections.cachedProjections[authority] == null) {
			Projections.cachedProjections[authority] = {};
		}
		projection = Projections.cachedProjections[authority][code];
		if (projection == null) {
			let stringDef = proj4String;
			if (stringDef == null) {
				let definitions = null;
				switch (authority) {
					case ProjectionConstants.AUTHORITY_EPSG:
						definitions = require('./projections/epsg').epsg;
						break;
					case ProjectionConstants.AUTHORITY_OGC:
						definitions = require('./projections/ogc').ogc;
						break;
					case ProjectionConstants.AUTHORITY_NONE:
						definitions = require('./projections/none').none;
						break;
					case ProjectionConstants.AUTHORITY_NSG:
						definitions = require('./projections/nsg').nsg;
						break;
				}
				if (definitions != null) {
					stringDef = definitions[code.toString()];
				}
			}
			if (stringDef == null) {
				throw new ProjectionException("Projection from authority: " + authority + ' with code: ' + code + ' not found.');
			}

			const name = authority + ':' + code;
			proj4.defs(name, stringDef);
			const definition = proj4.defs(name);
			projection = new Projection(authority, code.toString(), definition);
			Projections.cachedProjections[authority][code.toString()] = projection;
		}
		return projection;
	}

	/**
	 * Clear cache for a given authority
	 * @param authority
	 */
	public static clearCache (authority: string = null) {
		if (authority != null) {
			Projections.cachedProjections[authority] = {};
		} else {
			Projections.clear();
		}
	}

	public static clear () {
		Projections.cachedProjections = {};
	}

	/**
	 * Gets the code from this projection's name
	 * @param name
	 */
	public static getCode (name) {
		return Projections.parseAuthorityAndCode(name).code;
	}

	/**
	 * Gets metersPerUnit value from the projection, if provided
	 * @param name
	 */
	public static getMetersPerUnit (name) {
		let metersPerUnit = null
		const def = Projections.getProjectionForName(name).getDefinition();
		if (def != null) {
			metersPerUnit = def.to_meter;
		}
		return metersPerUnit;
	}

	/**
	 * Gets the units of this projection, if available
	 * @param name
	 */
	public static getUnits (name) {
		let units = null;
		const def = Projections.getProjectionForName(name).getDefinition()
		if (def != null) {
			units = def.units;
		}
		if (def != null && units == null) {
			const { authority, code } = Projections.parseAuthorityAndCode(name);
			if (authority === ProjectionConstants.AUTHORITY_EPSG && code === ProjectionConstants.EPSG_WORLD_GEODETIC_SYSTEM.toString()) {
				units = 'degrees';
			} else if (authority === ProjectionConstants.AUTHORITY_EPSG && code === ProjectionConstants.EPSG_WEB_MERCATOR.toString()) {
				units = 'm';
			} else if (authority === ProjectionConstants.AUTHORITY_OGC && code === ProjectionConstants.OGC_CRS84.toString()) {
				units = 'degrees';
			} else if (def.projName === 'longlat') {
				units = 'degrees';
			}
		}
		return units;
	}

	/**
	 * Gets the ProjectionDefinition for WebMercator
	 * @return ProjectionDefinition
	 */
	public static getWebMercatorProjection(): Projection {
		return Projections.getProjectionForName(ProjectionConstants.AUTHORITY_EPSG + ":" + ProjectionConstants.EPSG_WEB_MERCATOR);
	}

	/**
	 * Gets the ProjectionDefinition for WebMercator
	 * @return ProjectionDefinition
	 */
	public static getCRS84Projection(): Projection {
		return Projections.getProjectionForName(ProjectionConstants.AUTHORITY_OGC + ":" + ProjectionConstants.OGC_CRS84);
	}

	/**
	 * Gets the ProjectionDefinition for WGS84
	 * @return ProjectionDefinition
	 */
	public static getWGS84Projection(): Projection {
		return Projections.getProjectionForName(ProjectionConstants.AUTHORITY_EPSG + ":" + ProjectionConstants.EPSG_WORLD_GEODETIC_SYSTEM);
	}

	public static isWebMercator (proj: string | Projection): boolean {
		if (typeof proj === 'string') {
			const { authority, code } = Projections.parseAuthorityAndCode(proj);
			return authority === ProjectionConstants.AUTHORITY_EPSG && code === ProjectionConstants.EPSG_WEB_MERCATOR.toString();
		} else {
			return Projections.projectionsEqual(proj, Projections.getWebMercatorProjection());
		}
	}

	public static isWGS84 (proj: string | Projection): boolean {
		if (typeof proj === 'string') {
			const { authority, code } = Projections.parseAuthorityAndCode(proj);
			return authority === ProjectionConstants.AUTHORITY_EPSG && code === ProjectionConstants.EPSG_WORLD_GEODETIC_SYSTEM.toString();
		} else {
			return Projections.projectionsEqual(proj, Projections.getWGS84Projection());
		}
	}

	public static projectionsEqual (from: Projection, to: Projection): boolean {
		return from.equalsProjection(to);
	}

	public static getProjectionTransformation(from: string | Projection, to: string | Projection) {
		let fromDef: Projection = typeof from === 'string' ? Projections.getProjectionForName(from) : from;
		let toDef: Projection = typeof to === 'string' ? Projections.getProjectionForName(to) : to;
		// @ts-ignore
		return new ProjectionTransform(fromDef, toDef);
	}

	/**
	 * Parses the authority and code from a name
	 * @param name
	 */
	public static parseAuthorityAndCode(name: string) {
		let authority = null;
		let code = null;

		if (name === "CRS84") {
			authority = ProjectionConstants.AUTHORITY_OGC;
			code = name;
			// OGC URN handling
		} else if (name.toLowerCase().startsWith("urn:ogc:def:crs")) {
			const parts = name.split(":");
			if (parts.length === 7) {
				authority = parts[4];
				code = parts[6];
			}
		} else {
			const projectionParts = name.split(":");

			switch (projectionParts.length) {
				case 1:
					authority = ProjectionConstants.AUTHORITY_EPSG;
					code = projectionParts[0];
					break;
				case 2:
					authority = projectionParts[0];
					code = projectionParts[1];
					break;
				default:
					throw new ProjectionException("Invalid projection name '" + name + "', expected 'authority:code' or 'epsg_code'");
			}
		}
		return {
			authority,
			code
		};
	}
}
