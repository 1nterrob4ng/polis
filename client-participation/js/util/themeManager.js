// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Theme Manager
 * Applies theme customization from conversation config and embed parameters
 */

// Map of element names to CSS selectors
const HIDEABLE_ELEMENTS = {
  footer: "[data-test-footer]",
  logo: ".HeadingA img, #polis-donate img",
  help_text: "#helpTextWelcome, #helpTextGroups",
  stats: ".conversation-stats-header",
  visualization: "#vis_section",
  comment_form: "#commentFormParent",
  voting: ".readReactView",
  donate_banner: "#polis-donate",
};

/**
 * Load Google Fonts dynamically
 * @param {string} url - Google Fonts URL
 */
function loadGoogleFonts(url) {
  if (!url || typeof url !== "string") {
    return;
  }

  // Check if the URL is already loaded
  const existingLink = document.querySelector(`link[href="${url}"]`);
  if (existingLink) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Apply CSS custom properties for theming
 * @param {object} themeConfig - Theme configuration object
 */
function applyThemeColors(themeConfig) {
  if (!themeConfig) {
    return;
  }

  const style = document.createElement("style");
  style.id = "polis-theme-colors";

  let css = ":root {\n";

  if (themeConfig.theme_primary_color) {
    css += `  --theme-primary-color: ${themeConfig.theme_primary_color};\n`;
  }

  if (themeConfig.theme_text_color) {
    css += `  --theme-text-color: ${themeConfig.theme_text_color};\n`;
  }

  if (themeConfig.theme_background_color) {
    css += `  --theme-background-color: ${themeConfig.theme_background_color};\n`;
  }

  if (themeConfig.theme_button_color) {
    css += `  --theme-button-color: ${themeConfig.theme_button_color};\n`;
  }

  if (themeConfig.theme_font_family) {
    css += `  --theme-font-family: ${themeConfig.theme_font_family};\n`;
  }

  css += "}\n\n";

  // Apply the CSS custom properties to actual elements
  if (themeConfig.theme_primary_color) {
    css += `
a,
.HeadingC,
.Btn-alt {
  color: var(--theme-primary-color) !important;
}
`;
  }

  if (themeConfig.theme_text_color) {
    css += `
body,
.participationView,
p,
.HeadingA {
  color: var(--theme-text-color) !important;
}
`;
  }

  if (themeConfig.theme_background_color) {
    css += `
body,
.participationView,
.conversationViewRoot {
  background-color: var(--theme-background-color) !important;
}
`;
  }

  if (themeConfig.theme_button_color) {
    css += `
.Btn,
button[type="submit"] {
  background-color: var(--theme-button-color) !important;
}
`;
  }

  if (themeConfig.theme_font_family) {
    css += `
body,
.participationView,
p,
.HeadingA,
.HeadingC,
input,
textarea {
  font-family: var(--theme-font-family) !important;
}
`;
  }

  style.innerHTML = css;
  document.head.appendChild(style);
}

/**
 * Hide UI elements based on configuration
 * @param {string} hideElementsConfig - Comma-separated list of elements to hide
 */
function hideElements(hideElementsConfig) {
  if (!hideElementsConfig || typeof hideElementsConfig !== "string") {
    return;
  }

  const elementsToHide = hideElementsConfig
    .split(",")
    .map((e) => e.trim())
    .filter((e) => e.length > 0);

  elementsToHide.forEach(function (elementKey) {
    const selector = HIDEABLE_ELEMENTS[elementKey];
    if (selector) {
      // Try to hide immediately
      const elements = document.querySelectorAll(selector);
      elements.forEach(function (el) {
        el.style.display = "none";
        el.classList.add("displayNone");
      });

      // Also add a CSS rule to catch elements that load later
      const style = document.createElement("style");
      style.innerHTML = selector + " { display: none !important; }";
      document.head.appendChild(style);
    }
  });
}

/**
 * Apply theme configuration
 * @param {object} conversationData - Conversation data including theme fields
 * @param {object} embedParams - Parameters from embed.js (can override conversation config)
 */
function applyTheme(conversationData, embedParams) {
  // Merge configuration: embed params override conversation config
  const themeConfig = {
    theme_primary_color:
      embedParams.theme_primary_color || conversationData.theme_primary_color,
    theme_text_color:
      embedParams.theme_text_color || conversationData.theme_text_color,
    theme_background_color:
      embedParams.theme_background_color ||
      conversationData.theme_background_color,
    theme_button_color:
      embedParams.theme_button_color || conversationData.theme_button_color,
    theme_font_family:
      embedParams.theme_font_family || conversationData.theme_font_family,
    theme_google_fonts_url:
      embedParams.theme_google_fonts_url ||
      conversationData.theme_google_fonts_url,
    theme_hide_elements:
      embedParams.hide_elements || conversationData.theme_hide_elements,
  };

  // Load Google Fonts if specified
  if (themeConfig.theme_google_fonts_url) {
    loadGoogleFonts(themeConfig.theme_google_fonts_url);
  }

  // Apply colors and fonts
  applyThemeColors(themeConfig);

  // Hide elements
  if (themeConfig.theme_hide_elements) {
    hideElements(themeConfig.theme_hide_elements);
  }
}

module.exports = {
  applyTheme: applyTheme,
  loadGoogleFonts: loadGoogleFonts,
  applyThemeColors: applyThemeColors,
  hideElements: hideElements,
};
