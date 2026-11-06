// Remotion configuration. Applies to `npm run dev` and `npm run render`.
// Docs: https://www.remotion.dev/docs/config
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// three.js needs WebGL. "angle" gives GPU-accelerated WebGL in the
// headless browser Remotion uses for rendering. If renders come out black
// or fail on a machine without a GPU, change this to "swangle".
Config.setChromiumOpenGlRenderer("angle");

// WebGL scenes are heavy: render fewer frames in parallel to keep it stable.
Config.setConcurrency(2);
