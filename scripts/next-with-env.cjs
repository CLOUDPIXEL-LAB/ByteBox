#!/usr/bin/env node

process.env.BROWSERSLIST_IGNORE_OLD_DATA ??= "1";
process.env.BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA ??= "1";
process.env.PORT ??= "1334";

// eslint-disable-next-line @typescript-eslint/no-require-imports
require("next/dist/bin/next");
