/**
 * Projection constants
 */
export class ProjectionConstants {

	/**
	 * EPSG authority name
	 */
	public static readonly AUTHORITY_EPSG = "EPSG";

	/**
	 * No authority name
	 */
	public static readonly AUTHORITY_NONE = "NONE";

	/**
	 * OGC (Open Geospatial Consortium) authority name
	 */
	public static readonly AUTHORITY_OGC = "OGC";

	/**
	 * NSG (National Systems for Geospatial Intelligence) authority name
	 */
	public static readonly AUTHORITY_NSG = "NSG";

	/**
	 * Undefined Cartesian
	 */
	public static readonly UNDEFINED_CARTESIAN = -1;

	/**
	 * Undefined Geographic
	 */
	public static readonly UNDEFINED_GEOGRAPHIC = 0;

	/**
	 * EPSG world geodetic system
	 */
	public static readonly EPSG_WORLD_GEODETIC_SYSTEM = 4326;

	/**
	 * EPSG code for web mercator
	 */
	public static readonly EPSG_WEB_MERCATOR = 3857;

	/**
	 * EPSG code for world geodetic system geographical 3d
	 */
	public static readonly EPSG_WORLD_GEODETIC_SYSTEM_GEOGRAPHICAL_3D = 4979;

	/**
	 * OGC CRS84 code
	 */
	public static readonly OGC_CRS84 = "CRS84";

	/**
	 * Web Mercator Latitude Range
	 */
	public static readonly WEB_MERCATOR_MAX_LAT_RANGE = 85.0511287798066;

	/**
	 * Web Mercator Latitude Range
	 */
	public static readonly WEB_MERCATOR_MIN_LAT_RANGE = -85.05112877980659;

	/**
	 * Half the world distance in either direction
	 */
	public static WEB_MERCATOR_HALF_WORLD_WIDTH = 20037508.342789244;

	/**
	 * Half the world longitude width for WGS84
	 */
	public static WGS84_HALF_WORLD_LON_WIDTH = 180.0;

	/**
	 * Half the world latitude height for WGS84
	 */
	public static WGS84_HALF_WORLD_LAT_HEIGHT = 90.0;

	/**
	 * Web mercator precision
	 */
	public static WEB_MERCATOR_PRECISION = 0.0000000001;

}
