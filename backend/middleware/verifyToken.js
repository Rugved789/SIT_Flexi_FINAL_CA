// Deprecated shim: re-export the unified protect middleware from authMiddleware
// kept for backward compatibility in case any import remains elsewhere.
import { protect } from './authMiddleware.js';

export default protect;