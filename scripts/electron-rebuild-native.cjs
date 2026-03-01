/** ByteBox - Electron afterPack hook
 * Made with ❤️ by Pink Pixel
 *
 * Rebuilds better-sqlite3 for the Electron Node.js ABI after electron-builder
 * copies files to the output directory.  This is needed because
 * electron-builder's built-in npmRebuild doesn't reliably recompile native
 * modules when system Node and Electron ship different ABI versions.
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

/** @param {import("electron-builder").AfterPackContext} context */
module.exports = async function afterPack(context) {
  // Extract Electron version from the packager config — fall back to the
  // locally-installed electron package if the context doesn't expose it.
  const electronVersion =
    context.packager?.config?.electronVersion ||
    context.packager?.electronVersion ||
    require("electron/package.json").version;

  // Source directory (has binding.gyp + C++ source for compilation)
  const projectRoot = path.resolve(__dirname, "..");
  const srcBsqliteDir = path.join(projectRoot, "node_modules", "better-sqlite3");

  // Output directory (packaged app — just needs the compiled .node binary)
  const appDir = path.join(context.appOutDir, "resources", "app");
  const destBinaryDir = path.join(
    appDir, "node_modules", "better-sqlite3", "build", "Release"
  );

  if (!fs.existsSync(srcBsqliteDir) || !fs.existsSync(destBinaryDir)) {
    console.log("[afterPack] better-sqlite3 not found — skipping rebuild");
    return;
  }

  console.log(`[afterPack] Rebuilding better-sqlite3 for Electron ${electronVersion}…`);

  // 1. Rebuild in the SOURCE directory (has binding.gyp + C++ source)
  execSync(
    [
      "npx node-gyp rebuild",
      `--target=${electronVersion}`,
      "--arch=x64",
      "--dist-url=https://electronjs.org/headers",
      "--runtime=electron",
    ].join(" "),
    {
      cwd: srcBsqliteDir,
      stdio: "inherit",
    }
  );

  // 2. Copy the freshly-compiled binary into the packaged output
  const srcBinary = path.join(srcBsqliteDir, "build", "Release", "better_sqlite3.node");
  const destBinary = path.join(destBinaryDir, "better_sqlite3.node");
  fs.copyFileSync(srcBinary, destBinary);

  // 3. Restore system-Node build so `npm run dev` still works after packaging
  execSync("npm rebuild better-sqlite3 --no-progress", {
    cwd: projectRoot,
    stdio: "inherit",
  });

  console.log("[afterPack] better-sqlite3 rebuilt for Electron and restored for dev ✓");

  // 4. Copy .prisma/client into the packaged app.
  //    electron-builder's glob skips hidden (dot) directories, so the generated
  //    Prisma client never makes it into the output. We copy it manually.
  const srcPrismaClient = path.join(projectRoot, "node_modules", ".prisma", "client");
  const destPrismaClient = path.join(appDir, "node_modules", ".prisma", "client");

  if (fs.existsSync(srcPrismaClient)) {
    console.log("[afterPack] Copying .prisma/client into packaged app…");
    fs.cpSync(srcPrismaClient, destPrismaClient, { recursive: true });
    console.log("[afterPack] .prisma/client copied ✓");
  } else {
    console.warn("[afterPack] WARNING: node_modules/.prisma/client not found — run `npx prisma generate` first");
  }
};
