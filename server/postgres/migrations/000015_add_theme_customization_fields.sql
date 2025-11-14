-- Migration: Add theme customization fields to conversations table
-- Allows conversation owners to customize colors, fonts, and hide UI elements

-- Add theme color fields
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS theme_primary_color VARCHAR(20),
  ADD COLUMN IF NOT EXISTS theme_text_color VARCHAR(20),
  ADD COLUMN IF NOT EXISTS theme_background_color VARCHAR(20),
  ADD COLUMN IF NOT EXISTS theme_button_color VARCHAR(20);

-- Add typography fields
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS theme_font_family VARCHAR(200),
  ADD COLUMN IF NOT EXISTS theme_google_fonts_url VARCHAR(500);

-- Add element visibility control (JSON array of element names to hide)
-- Example: ["footer", "logo", "help_text", "stats"]
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS theme_hide_elements TEXT;

-- Add comments for documentation
COMMENT ON COLUMN conversations.theme_primary_color IS 'Primary brand color (hex format: #03a9f4)';
COMMENT ON COLUMN conversations.theme_text_color IS 'Main text color (hex format)';
COMMENT ON COLUMN conversations.theme_background_color IS 'Background color (hex format)';
COMMENT ON COLUMN conversations.theme_button_color IS 'Button/action color (hex format)';
COMMENT ON COLUMN conversations.theme_font_family IS 'Font family name (e.g., "Roboto, sans-serif")';
COMMENT ON COLUMN conversations.theme_google_fonts_url IS 'Optional Google Fonts URL to load custom fonts';
COMMENT ON COLUMN conversations.theme_hide_elements IS 'Comma-separated list of UI elements to hide (e.g., "footer,logo,help_text")';
