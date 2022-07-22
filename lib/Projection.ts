import { ProjectionDefinition } from "proj4";
import { ProjectionConstants, Projections, ProjectionTransform } from "./internal";

/**
 * Single Projection for an authority and code
 */
export class Projection {

	/**
	 * Projection authority
	 */
	private readonly authority: string;

	/**
	 * Coordinate code
	 */
	private readonly code: string;

	/**
	 * Definition
	 */
	private readonly definition: ProjectionDefinition;

	/**
	 * Constructor
	 *
	 * @param authority
	 *            coordinate authority
	 * @param code
	 *            coordinate code
	 * @param definition
	 *            proj4 definition
	 */
	public constructor(authority: string, code: string, definition: ProjectionDefinition) {
		this.authority = authority;
		this.code = code;
		this.definition = definition;
	}

	/**
	 * Get the coordinate authority
	 * 
	 * @return authority
	 */
	public getAuthority(): string {
		return this.authority;
	}

	/**
	 * Get the coordinate code
	 * 
	 * @return code
	 */
	public getCode(): string {
		return this.code;
	}

	/**
	 * Get the projection definition
	 * @return definition
	 */
	public getDefinition(): ProjectionDefinition {
		return this.definition;
	}


	/**
	 * Get the transformation from this Projection to the EPSG code. Each thread
	 * of execution should have it's own transformation.
	 *
	 * @param projection projection
	 * @return transform
	 */
	public getTransformation(projection: Projection): ProjectionTransform {
		return Projections.getProjectionTransformation(this, projection);
	}

	/**
	 * Get the inverse transformation from this Projection to the EPSG code. Each thread
	 * of execution should have it's own transformation.
	 *
	 * @param projection projection
	 * @return transform
	 */
	public getInverseTransformation(projection: Projection): ProjectionTransform {
		return Projections.getProjectionTransformation(projection, this);
	}

	/**
	 * Get the transformation from this Projection to the EPSG code. Each thread
	 * of execution should have it's own transformation.
	 *
	 *
	 * @param authority
	 *            coordinate authority
	 * @param code
	 *            coordinate code
	 * @return transform
	 */
	public getTransformationTo(authority: string = ProjectionConstants.AUTHORITY_EPSG, code: string | number): ProjectionTransform {
		return Projections.getProjectionTransformation(this, Projections.getProjection(authority, code));
	}

	/**
	 * Get the inverse transformation from this Projection to the EPSG code. Each thread
	 * of execution should have it's own transformation.
	 *
	 *
	 * @param authority
	 *            coordinate authority
	 * @param code
	 *            coordinate code
	 * @return transform
	 */
	public getInverseTransformationTo(authority: string = ProjectionConstants.AUTHORITY_EPSG, code: string | number): ProjectionTransform {
		return Projections.getProjectionTransformation(this, Projections.getProjection(authority, code));
	}



	/**
	 * Check if this projection is equal to the authority and code
	 * @param authority coordinate authority
	 * @param code coordinate code
	 * @return true if equal
	 */
	public equals(authority: string, code: string): boolean {
		return this.authority === authority && this.code === code;
	}

	/**
	 * Check if this projection is equal to the authority and code
	 * @param authority coordinate authority
	 * @param code coordinate code
	 * @return true if equal
	 */
	public equalsProjection(other: Projection): boolean {
		return this.authority === other.authority && this.code === other.code;
	}



	/**
	 * {@inheritDoc}
	 */
	public toString(): string {
		return this.authority + ":" + this.code;
	}

}
