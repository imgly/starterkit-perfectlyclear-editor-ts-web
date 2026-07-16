/**
 * CE.SDK Perfectly Clear Editor - Initialization Module
 *
 * This module provides the main entry point for initializing the Perfectly
 * Clear editor. Import and call `initPerfectlyClearEditor()` to configure a
 * CE.SDK instance with one-click image enhancement prominently featured.
 *
 * @see https://img.ly/docs/cesdk/js/plugins/perfectly-clear-e0fa1c/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  PremiumTemplatesAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration plugin
import { DesignEditorConfig } from './config/plugin';

// Perfectly Clear plugin
import {
  setupPerfectlyClearPlugin,
  type SetupPerfectlyClearPluginOptions
} from './plugins/perfectly-clear';

// Re-export for external use
export { DesignEditorConfig } from './config/plugin';
export {
  setupPerfectlyClearPlugin,
  type SetupPerfectlyClearPluginOptions
} from './plugins/perfectly-clear';

export interface InitPerfectlyClearEditorOptions {
  /**
   * Perfectly Clear plugin options. The `apiKey` is forwarded to
   * `setupPerfectlyClearPlugin` — see its docs for behaviour when the
   * key is empty.
   */
  perfectlyClear: SetupPerfectlyClearPluginOptions;
}

/**
 * Initialize the CE.SDK Perfectly Clear Editor with a complete configuration.
 *
 * This function configures a CE.SDK instance with:
 * - Design editor UI configuration
 * - One-click image enhancement via the official plugin (canvas menu)
 * - Asset source plugins (templates, images, shapes, text, etc.)
 * - Actions dropdown in navigation bar
 * - Disabled placeholder and preview features
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 * @param options - Editor options. `perfectlyClear.apiKey` is the
 *   Perfectly Clear (eyeQ) client API key; the caller is responsible
 *   for sourcing it from its environment so this module can be copied
 *   into any host project unchanged.
 */
export async function initPerfectlyClearEditor(
  cesdk: CreativeEditorSDK,
  options: InitPerfectlyClearEditorOptions
) {
  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  // Add the design editor configuration plugin
  // This sets up the UI, features, settings, and i18n for design editing
  await cesdk.addPlugin(new DesignEditorConfig());

  // ============================================================================
  // Runtime Configuration
  // ============================================================================

  // Set role (replaces deprecated config.role)
  cesdk.engine.editor.setRole('Creator');

  // Set theme (replaces deprecated config.theme)
  cesdk.ui.setTheme('light');

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  // Color palettes for design
  await cesdk.addPlugin(new ColorPaletteAssetSource());

  // Typeface/font assets
  await cesdk.addPlugin(new TypefaceAssetSource());

  // Text presets (headlines, body text styles)
  await cesdk.addPlugin(new TextAssetSource());

  // Text components (pre-designed text layouts)
  await cesdk.addPlugin(new TextComponentAssetSource());

  // Vector shapes (rectangles, circles, arrows, etc.)
  await cesdk.addPlugin(new VectorShapeAssetSource());

  // Sticker assets
  await cesdk.addPlugin(new StickerAssetSource());

  // Visual effects (adjustments, vignette, etc.)
  await cesdk.addPlugin(new EffectsAssetSource());

  // Photo filters (LUT, duotone)
  await cesdk.addPlugin(new FiltersAssetSource());

  // Blur presets for blur effects
  await cesdk.addPlugin(new BlurAssetSource());

  // Page format presets (A4, Letter, social media sizes)
  await cesdk.addPlugin(new PagePresetsAssetSource());

  // Crop presets (aspect ratios)
  await cesdk.addPlugin(new CropPresetsAssetSource());

  // Local upload sources (images) - replaces config.callbacks.onUpload
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );

  // Demo assets (templates, images)
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );

  // Premium templates
  await cesdk.addPlugin(
    new PremiumTemplatesAssetSource({
      include: ['ly.img.templates.premium.*']
    })
  );

  // ============================================================================
  // Perfectly Clear Plugin
  // ============================================================================

  // Setup one-click image enhancement with canvas menu
  // - Canvas menu: Adds "Enhance" option when an image is selected
  // The Perfectly Clear runtime runs fully in-browser via WebAssembly.
  await setupPerfectlyClearPlugin(cesdk, options.perfectlyClear);
}
