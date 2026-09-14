/**
 * CE.SDK Perfectly Clear Editor Starterkit - Main Entry Point
 *
 * A design editor with one-click image enhancement prominently featured.
 * Select an image to see the "Enhance" option in the canvas menu.
 *
 * @see https://img.ly/docs/cesdk/js/plugins/perfectly-clear/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';

import { initPerfectlyClearEditor } from './imgly';
import { resolveAssetPath } from './imgly/resolveAssetPath';

// ============================================================================
// Configuration
// ============================================================================

const config = {
  userId: 'starterkit-perfectlyclear-editor-user',
};

// ============================================================================
// Initialize Perfectly Clear Editor
// ============================================================================

CreativeEditorSDK.create('#cesdk_container', config)
  .then(async (cesdk) => {
    // Debug access (remove in production)
    (window as any).cesdk = cesdk;

    await initPerfectlyClearEditor(cesdk, {
      perfectlyClear: {
        // Read the Perfectly Clear API key from the kit's env file.
        // Customers cloning the `imgly/` directory into their own app
        // should source this however their host environment prefers and
        // pass it through here — `setupPerfectlyClearPlugin` itself
        // takes no env var.
        apiKey: (undefined as string | undefined)
      }
    });

    // ============================================================================
    // Scene Loading
    // ============================================================================

    // Load the Perfectly Clear demo template — an archive bundling the
    // scene plus its fonts and images, ready to enhance.
    await cesdk.loadFromArchiveURL(
      resolveAssetPath('/assets/enhance-image.archive')
    );
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize CE.SDK:', error);
  });
