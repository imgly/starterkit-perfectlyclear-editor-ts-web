/**
 * Perfectly Clear Plugin
 *
 * Adds one-click image enhancement using @imgly/plugin-perfectlyclear-web.
 * Runs fully in-browser via WebAssembly — scene detection, skin-tone
 * correction, AI color, noise reduction — on the currently selected image
 * fill.
 *
 * ## Installation
 *
 * ```bash
 * npm install @imgly/plugin-perfectlyclear-web
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { setupPerfectlyClearPlugin } from './plugins/perfectly-clear';
 *
 * // After cesdk initialization
 * await setupPerfectlyClearPlugin(cesdk, { apiKey: 'YOUR_PFC_API_KEY' });
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/plugins/perfectly-clear-e0fa1c/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import PerfectlyClearPlugin, {
  PLUGIN_ID
} from '@imgly/plugin-perfectlyclear-web';

export interface SetupPerfectlyClearPluginOptions {
  /**
   * Perfectly Clear (eyeQ) client API key. Must be authorized for the
   * page's origin — Perfectly Clear validates the page hostname against
   * its certificate endpoint at runtime.
   *
   * If empty or missing, the plugin is skipped (with a console warning)
   * so the editor still boots in environments where the key is not
   * configured.
   */
  apiKey: string | undefined;
}

/**
 * Sets up the Perfectly Clear plugin and inserts its canvas-menu button.
 *
 * Unlike most CE.SDK plugins, `@imgly/plugin-perfectlyclear-web` registers
 * its canvas-menu component but does **not** insert it into the canvas menu
 * order on its own. That is intentional: it lets the plugin coexist with
 * the AI quick-action popover without producing two Enhance buttons. So
 * the kit's install does two things:
 *
 * 1. `addPlugin(PerfectlyClearPlugin({ apiKey }))` — registers the
 *    component and wires the fill-processing state machine.
 * 2. `setComponentOrder({ in: 'ly.img.canvas.menu', when: { editMode:
 *    'Transform' } }, [...])` — prepends the plugin's canvas-menu component
 *    to the Transform-mode order the shared design-editor config
 *    established (the deprecated `setCanvasMenuOrder` writes a different,
 *    shadowed order, so the button would never render).
 *
 * @param cesdk - The CreativeEditorSDK instance
 * @param options - Plugin options. `apiKey` is required at runtime — the
 *   function falls back to a no-op (with a console warning) when it is
 *   empty so the surrounding editor still boots in unconfigured
 *   environments (e.g. local dev without `.env`).
 */
export async function setupPerfectlyClearPlugin(
  cesdk: CreativeEditorSDK,
  options: SetupPerfectlyClearPluginOptions
): Promise<void> {
  const { apiKey } = options;
  if (!apiKey) {
    // eslint-disable-next-line no-console
    console.warn(
      'Perfectly Clear plugin disabled — no apiKey provided. ' +
        'Pass an apiKey via setupPerfectlyClearPlugin(cesdk, { apiKey }).'
    );
    return;
  }

  // 1. Register the plugin.
  //    The plugin defaults baseURL to the IMG.LY CDN, which is fine for a
  //    starter kit. Production integrations should self-host the runtime
  //    assets (see the plugin README) and override baseURL.
  await cesdk.addPlugin(PerfectlyClearPlugin({ apiKey }));

  // 2. Insert the plugin's canvas-menu component into the canvas menu.
  //    The shared design-editor config configures the canvas menu via the
  //    modern `setComponentOrder` API, qualified to Transform mode — the
  //    edit mode you're in when a block is selected (see
  //    `src/imgly/config/ui/canvas.ts`). The deprecated
  //    `setCanvasMenuOrder`/`getCanvasMenuOrder` operate on the *unqualified*
  //    order, which the Transform-qualified order shadows on selection — so
  //    the button never renders. We must prepend using the exact same
  //    context the shared config uses.
  const canvasMenuLocation = {
    in: 'ly.img.canvas.menu',
    when: { editMode: 'Transform' }
  } as const;

  cesdk.ui.setComponentOrder(canvasMenuLocation, [
    `${PLUGIN_ID}.canvasMenu`,
    ...cesdk.ui.getComponentOrder(canvasMenuLocation)
  ]);
}
