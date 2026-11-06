// Fonts are stored in /public/fonts so renders work offline and Arabic
// always uses a proper Arabic typeface. All fonts are SIL Open Font Licence.
// To add a font: drop the .woff2/.ttf into public/fonts and add a loadFont() call.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const ARABIC_RANGE =
  "U+0600-06FF, U+0750-077F, U+0870-08FF, U+FB50-FDFF, U+FE70-FEFF, U+200C-200E, U+25CC";

export const TITLE_FONT = "Amiri";
export const ARABIC_FONT = "Noto Naskh Arabic";
export const LATIN_FONT = "Poppins";

loadFont({ family: TITLE_FONT, url: staticFile("fonts/Amiri-Bold-arabic.woff2"), weight: "700", unicodeRange: ARABIC_RANGE });
loadFont({ family: TITLE_FONT, url: staticFile("fonts/Amiri-Bold-latin.woff2"), weight: "700" , unicodeRange: "U+0000-00FF, U+2000-206F"});
loadFont({ family: ARABIC_FONT, url: staticFile("fonts/NotoNaskhArabic-Bold.woff2"), weight: "700" });
loadFont({ family: LATIN_FONT, url: staticFile("fonts/Poppins-Bold.woff2"), weight: "700" });
