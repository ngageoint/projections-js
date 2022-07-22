import proj4, { Converter, InterfaceCoordinates } from "proj4";
import { Projection, ProjectionConstants, Projections } from "./internal";

export class ProjectionTransform {
  from: Projection;
  to: Projection;
  converter: Converter;
  _transform: Function;
  constructor (from: Projection, to: Projection) {
    this.from = from;
    this.to = to;

    // @ts-ignore
    this.converter = proj4(from.getDefinition(), to.getDefinition());
    if (Projections.projectionsEqual(from, to)) {
      this._transform = function (x: number, y: number): Array<number> {
        return [x, y];
      }
    } else if (Projections.isWGS84(from) && Projections.isWebMercator(to)) {
      this._transform = function (x: number, y: number): Array<number> {
        return this.converter.forward([Math.max(-ProjectionConstants.WGS84_HALF_WORLD_LON_WIDTH, Math.min(ProjectionConstants.WGS84_HALF_WORLD_LON_WIDTH, x)), Math.max(ProjectionConstants.WEB_MERCATOR_MIN_LAT_RANGE, Math.min(ProjectionConstants.WEB_MERCATOR_MAX_LAT_RANGE, y))]);
      }
    } else {
      this._transform = function (x: number, y: number): Array<number> {
        return this.converter.forward([x, y]);
      }
    }
  }

  /**
   * Transform a x and y location
   * @param x x coordinate
   * @param y y coordinate
   * @return transformed coordinates as [x, y]
   */
  public transform(x: number, y: number): Array<number> {
    return this._transform(x, y);
  }

  /**
   * Transform a coordinates array
   * @param array coordinate
   * @return transformed coordinates as [x, y]
   */
  public transformCoordinateArray(array: Array<number>): Array<number> {
    return this._transform(array[0], array[1]);
  }

  /**
   * Transform InterfaceCoordinates
   * @return transformed coordinates as {x, y}
   * @param coordinate
   */
  public transformCoordinate(coordinate: InterfaceCoordinates): InterfaceCoordinates {
    const bounds = this._transform(coordinate.x, coordinate.y);
    return {
      x: bounds[0],
      y: bounds[1]
    };
  }

  /**
   * Transform the coordinate bounds
   *
   * @param minX min x
   * @param minY min y
   * @param maxX max x
   * @param maxY max y
   * @return transformed coordinate bounds as [minX, minY, maxX, maxY]
   */
  public transformBounds(minX: number, minY: number, maxX: number, maxY: number): Array<number> {
    const projectedLowerLeft = this.transform(minX, minY);
    const projectedLowerRight = this.transform(maxX, minY);
    const projectedUpperRight = this.transform(maxX, maxY);
    const projectedUpperLeft = this.transform(minX, maxY);

    const bounds = [];
    bounds[0] = Math.min(projectedLowerLeft[0], projectedLowerRight[0], projectedUpperRight[0], projectedUpperLeft[0]);
    bounds[1] = Math.min(projectedLowerLeft[1], projectedLowerRight[1], projectedUpperRight[1], projectedUpperLeft[1]);
    bounds[2] = Math.max(projectedLowerLeft[0], projectedLowerRight[0], projectedUpperRight[0], projectedUpperLeft[0]);
    bounds[3] = Math.max(projectedLowerLeft[1], projectedLowerRight[1], projectedUpperRight[1], projectedUpperLeft[1]);

    return bounds;
  }

  /**
   * Get the from projection in the transform
   * @return from projection
   */
  public getFromProjection(): Projection {
    return this.from;
  }

  /**
   * Get the to projection in the transform
   * @return to projection
   */
  public getToProjection(): Projection {
    return this.to;
  }

  /**
   * Get the transform
   * @return transform
   */
  public getConverter(): Converter {
    return this.converter;
  }

  public getInverseTransformation(): ProjectionTransform {
    return new ProjectionTransform(this.to, this.from);
  }

}