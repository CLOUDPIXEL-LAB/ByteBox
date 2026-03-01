/** ByteBox - Electron Preload Script
 * Made with ❤️ by Pink Pixel
 *
 * Runs in an isolated context before the renderer page loads.
 * Only expose the minimum surface the renderer actually needs.
 * contextIsolation: true  —  nothing from Node.js leaks into the page.
 */

import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  /** true when running inside the desktop app, undefined in a browser */
  isElectron: true as const,
  /** 'linux' | 'darwin' | 'win32' — useful for platform-specific UI hints */
  platform: process.platform,
});
