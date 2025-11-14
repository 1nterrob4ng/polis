diff --git a/DEPLOYMENT_COOLIFY.md b/DEPLOYMENT_COOLIFY.md
deleted file mode 100644
index e71821cf..00000000
--- a/DEPLOYMENT_COOLIFY.md
+++ /dev/null
@@ -1,250 +0,0 @@
-  Step-by-Step Deployment Guide for Polis on Coolify
-
-  1. Prepare Your Repository
-
-  - Ensure your Polis fork is in a Git repository (GitHub, GitLab, etc.)
-  - Make sure your repository is accessible to Coolify
-
-  2. Create a New Project in Coolify
-
-  - Log into your Coolify dashboard
-  - Click "New Project" or "Add Resource"
-  - Select "Docker Compose" as the deployment type
-  - Connect your Git repository (use GitHub App for private repos, or public repo URL)
-
-  3. Configure Git Settings
-
-  - Repository: Point to your polis-fork repository
-  - Branch: Select theatre (or your main branch)
-  - Base Directory: Leave empty (root of repo)
-  - Docker Compose File: docker-compose.yml
-
-  4. Set Up Environment Variables
-
-  In Coolify, configure these essential environment variables based on example.env:
-
-  Database (Critical):
-  POSTGRES_DB=polis-prod
-  POSTGRES_USER=postgres
-  POSTGRES_PASSWORD=<generate-secure-password>
-  DATABASE_URL=postgres://postgres:<password>@postgres:5432/polis-prod
-  POSTGRES_DOCKER=true
-  DATABASE_SSL=false
-
-  Domain & Hosting:
-  DEV_MODE=false
-  API_PROD_HOSTNAME=<your-domain.com>
-  DOMAIN_OVERRIDE=<your-domain.com>
-  EMBED_SERVICE_HOSTNAME=<your-domain.com>
-  HTTP_PORT=80
-  HTTPS_PORT=443
-
-  OIDC Authentication (Required):
-  AUTH_AUDIENCE=users
-  AUTH_CLIENT_ID=<your-client-id>
-  AUTH_CLIENT_SECRET=<generate-secure-secret>
-  AUTH_ISSUER=https://<your-domain.com>/
-  AUTH_NAMESPACE=https://<your-domain.com>/
-  POLIS_JWT_AUDIENCE=participants
-  POLIS_JWT_ISSUER=https://<your-domain.com>/
-  LOGIN_CODE_PEPPER=<generate-random-string>
-
-  JWT Keys (Generate locally first):
-  # Run locally: make generate-jwt-keys
-  # Then base64 encode them for production:
-  JWT_PRIVATE_KEY=<base64-encoded-private-key>
-  JWT_PUBLIC_KEY=<base64-encoded-public-key>
-
-  Email Configuration:
-  POLIS_FROM_ADDRESS="Your Team <noreply@your-domain.com>"
-
-  AWS/Storage (if using real AWS, otherwise omit for local-services profile):
-  AWS_REGION=us-east-1
-  AWS_ACCESS_KEY_ID=<your-key>
-  AWS_SECRET_ACCESS_KEY=<your-secret>
-  AWS_S3_BUCKET_NAME=<your-bucket>
-
-  Optional Services:
-  AKISMET_ANTISPAM_API_KEY=<if-using-spam-protection>
-  GA_TRACKING_ID=<if-using-analytics>
-  ANTHROPIC_API_KEY=<if-using-AI-features>
-
-  5. Configure Docker Compose Profiles
-
-  For production deployment, you'll want to run with the postgres profile:
-
-  In Coolify's advanced settings, set the Docker Compose command to:
-  docker compose --profile postgres up -d
-
-  Note: For production, you may want to:
-  - Omit --profile local-services (uses real AWS S3, DynamoDB instead of MinIO/local)
-  - Include --profile prod if you want Datadog monitoring
-
-  6. Configure Persistent Storage
-
-  Ensure Coolify creates volumes for:
-  - postgres_data - Database persistence
-  - server-logs - Server logs
-  - ollama-models - AI models (if using Ollama)
-  - minio_data - Local file storage (if using MinIO)
-  - dynamodb-data - Local DynamoDB (if using local-services)
-
-  7. Set Up Domain & SSL
-
-  In Coolify:
-  - Domain: Add your custom domain (e.g., polis.yourdomain.com)
-  - Force HTTPS: Enable
-  - Auto Deploy: Enable (optional, for automatic deployments on git push)
-  - Coolify will automatically provision SSL certificates via Let's Encrypt
-
-  8. Port Configuration
-
-  Configure these port mappings in Coolify:
-  - 80:80 (HTTP - nginx-proxy)
-  - 443:443 (HTTPS - nginx-proxy)
-
-  Other services don't need external port exposure as they communicate internally via polis-net network.
-
-  9. Resource Limits
-
-  Set appropriate resource limits (adjust based on your server):
-  - Delphi: 16GB RAM, 2 CPUs (already configured in docker-compose.yml)
-  - Server: 2GB RAM recommended
-  - Math: 4GB RAM recommended
-  - Postgres: 4GB RAM recommended
-
-  10. Deploy
-
-  1. Click "Deploy" in Coolify
-  2. Monitor the build logs for any errors
-  3. Wait for all services to start (may take 5-10 minutes on first deployment)
-
-  11. Post-Deployment Steps
-
-  a) Run Database Migrations:
-  The postgres container with Dockerfile-db automatically runs migrations, but verify:
-  # In Coolify's terminal/shell for postgres container:
-  # Check that migrations ran successfully
-
-  b) Create Admin User:
-  Visit https://your-domain.com/createuser to create your first admin account.
-
-  c) Health Checks:
-  - Visit https://your-domain.com to verify the site loads
-  - Check service logs in Coolify for any errors
-  - Test creating a conversation and adding comments
-
-  12. Configure External Services (Production)
-
-  For production use, configure:
-
-  Email (SES/SMTP):
-  # For AWS SES:
-  AWS_REGION=us-east-1
-  # Remove SES_ENDPOINT (only for local dev)
-
-  S3 Storage:
-  # Remove AWS_S3_ENDPOINT (uses real AWS S3)
-  AWS_S3_BUCKET_NAME=your-production-bucket
-
-  DynamoDB:
-  # Remove DYNAMODB_ENDPOINT (uses real AWS DynamoDB)
-
-  13. Monitoring & Maintenance
-
-  - Enable Auto Deploy for automatic deployments on git push
-  - Set up Backups for postgres volume in Coolify
-  - Monitor Resource Usage in Coolify dashboard
-  - Check Logs regularly for errors
-
-  14. Rollback Capability
-
-  Coolify provides easy rollback:
-  - Go to your deployment in Coolify
-  - Click "Deployments" history
-  - Select a previous successful deployment to rollback
-
-  ---
-  Production Checklist
-
-  Before going live:
-  - Generate secure passwords for all credentials
-  - Configure production domain and SSL
-  - Set up real AWS services (S3, DynamoDB, SES)
-  - Configure database backups
-  - Test email delivery
-  - Set DEV_MODE=false
-  - Configure monitoring (Datadog optional)
-  - Test conversation creation and voting
-  - Set up proper OIDC provider (not simulator)
-
-> step 4, where would I run the make command?
-
-⏺ Run the make generate-jwt-keys command locally on your machine where you have the repository cloned (/YOUR_USER_PATH/polis-fork).
-
-  Here's the workflow:
-
-  # 1. In your local repository directory:
-  cd /YOUR_USER_PATH/polis-fork
-  make generate-jwt-keys
-
-  This creates:
-  - server/keys/jwt-private.pem
-  - server/keys/jwt-public.pem
-
-  # 2. Then base64-encode them for production environment variables:
-  cat server/keys/jwt-private.pem | base64
-  cat server/keys/jwt-public.pem | base64
-
-  # 3. Copy the base64 output and add to Coolify environment variables:
-  JWT_PRIVATE_KEY=<paste-base64-private-key-here>
-  JWT_PUBLIC_KEY=<paste-base64-public-key-here>
-
-  Important:
-  - Don't commit these keys to git (they should be in .gitignore)
-  - Store them securely (password manager, secrets vault)
-  - In Coolify, use the base64-encoded versions as environment variables
-  - The Docker containers will decode them at runtime
-
-  Alternative: If the make command doesn't exist, you can generate RSA keys manually:
-
-  mkdir -p server/keys
-  openssl genrsa -out server/keys/jwt-private.pem 2048
-  openssl rsa -in server/keys/jwt-private.pem -pubout -out server/keys/jwt-public.pem
-
-> and then I send them to the server that runs coolify?
-
-⏺ No, you don't send files to the Coolify server.
-
-  Instead, you paste the base64-encoded strings as environment variables in Coolify's web interface. Here's the exact workflow:
-
-  Complete Process:
-
-  1. Generate Keys Locally
-
-  cd /YOUR_USER_PATH/polis-fork
-  make generate-jwt-keys
-
-  2. Base64 Encode Them
-
-  # macOS:
-  cat server/keys/jwt-private.pem | base64
-
-  cat server/keys/jwt-public.pem | base64
-
-  3. Add to Coolify (via Web UI)
-
-  1. Go to your Coolify dashboard
-  2. Navigate to your Polis project → Environment Variables
-  3. Add these two variables:
-    - Key: JWT_PRIVATE_KEYValue: <paste-the-base64-encoded-private-key>
-    - Key: JWT_PUBLIC_KEYValue: <paste-the-base64-encoded-public-key>
-
-  4. How It Works
-
-  When the Docker containers start, the Polis server will:
-  - Read these environment variables
-  - Decode the base64 strings
-  - Write them to files inside the container at /app/keys/jwt-private.pem and /app/keys/jwt-public.pem
-
-  You never manually copy files to the Coolify server - everything is managed through environment variables in the Coolify interface.
\ No newline at end of file
diff --git a/client-admin/src/actions/index.js b/client-admin/src/actions/index.js
index 2ccba805..8708ce0c 100644
--- a/client-admin/src/actions/index.js
+++ b/client-admin/src/actions/index.js
@@ -242,9 +242,6 @@ const updateConversationData = (conversationData, field, value) => {
   data[field] = value
   const bodyData = Object.assign({}, conversationData, data)
 
-  console.log('[Theme Debug] Updating conversation field:', field, '=', value)
-  console.log('[Theme Debug] Full body data:', bodyData)
-
   return PolisNet.polisPut('/api/v3/conversations', bodyData)
 }
 
diff --git a/client-admin/src/components/conversation-admin/ConversationConfig.js b/client-admin/src/components/conversation-admin/ConversationConfig.js
index 12afe480..14096c7a 100644
--- a/client-admin/src/components/conversation-admin/ConversationConfig.js
+++ b/client-admin/src/components/conversation-admin/ConversationConfig.js
@@ -166,183 +166,6 @@ const ConversationConfig = () => {
         [EXPERIMENTAL FEATURE] Participants can see the &quot;This comment is important&quot;
         checkbox
       </CheckboxField>
-
-      <Heading
-        as="h6"
-        sx={{
-          fontSize: [1, null, 2],
-          lineHeight: 'body',
-          my: [3, null, 4]
-        }}>
-        Theme Customization
-      </Heading>
-
-      <Text sx={{ display: 'block', mb: [3], fontStyle: 'italic', color: 'textSecondary' }}>
-        Customize colors, fonts, and visibility of UI elements. Changes apply to embedded
-        conversations without redeployment.
-      </Text>
-
-      <Box sx={{ mb: [3] }}>
-        <Text sx={{ display: 'block', mb: [2] }}>Primary Color</Text>
-        <input
-          type="color"
-          style={{
-            display: 'block',
-            width: '100px',
-            height: '40px',
-            border: '1px solid #ccc',
-            borderRadius: '4px',
-            cursor: 'pointer'
-          }}
-          data-testid="theme-primary-color"
-          onBlur={(e) => handleStringValueChange('theme_primary_color', e.target.value)}
-          onChange={(e) => handleConfigInputTyping('theme_primary_color', e.target.value)}
-          value={conversationData.theme_primary_color || '#03a9f4'}
-        />
-        <Text sx={{ fontSize: [0], color: 'textSecondary', mt: [1] }}>
-          Brand color for links and primary actions
-        </Text>
-      </Box>
-
-      <Box sx={{ mb: [3] }}>
-        <Text sx={{ display: 'block', mb: [2] }}>Text Color</Text>
-        <input
-          type="color"
-          style={{
-            display: 'block',
-            width: '100px',
-            height: '40px',
-            border: '1px solid #ccc',
-            borderRadius: '4px',
-            cursor: 'pointer'
-          }}
-          data-testid="theme-text-color"
-          onBlur={(e) => handleStringValueChange('theme_text_color', e.target.value)}
-          onChange={(e) => handleConfigInputTyping('theme_text_color', e.target.value)}
-          value={conversationData.theme_text_color || '#000000'}
-        />
-        <Text sx={{ fontSize: [0], color: 'textSecondary', mt: [1] }}>Main text color</Text>
-      </Box>
-
-      <Box sx={{ mb: [3] }}>
-        <Text sx={{ display: 'block', mb: [2] }}>Background Color</Text>
-        <input
-          type="color"
-          style={{
-            display: 'block',
-            width: '100px',
-            height: '40px',
-            border: '1px solid #ccc',
-            borderRadius: '4px',
-            cursor: 'pointer'
-          }}
-          data-testid="theme-background-color"
-          onBlur={(e) => handleStringValueChange('theme_background_color', e.target.value)}
-          onChange={(e) => handleConfigInputTyping('theme_background_color', e.target.value)}
-          value={conversationData.theme_background_color || '#ffffff'}
-        />
-        <Text sx={{ fontSize: [0], color: 'textSecondary', mt: [1] }}>
-          Page background color
-        </Text>
-      </Box>
-
-      <Box sx={{ mb: [3] }}>
-        <Text sx={{ display: 'block', mb: [2] }}>Button Color</Text>
-        <input
-          type="color"
-          style={{
-            display: 'block',
-            width: '100px',
-            height: '40px',
-            border: '1px solid #ccc',
-            borderRadius: '4px',
-            cursor: 'pointer'
-          }}
-          data-testid="theme-button-color"
-          onBlur={(e) => handleStringValueChange('theme_button_color', e.target.value)}
-          onChange={(e) => handleConfigInputTyping('theme_button_color', e.target.value)}
-          value={conversationData.theme_button_color || '#03a9f4'}
-        />
-        <Text sx={{ fontSize: [0], color: 'textSecondary', mt: [1] }}>
-          Button and action color
-        </Text>
-      </Box>
-
-      <Box sx={{ mb: [3] }}>
-        <Text sx={{ display: 'block', mb: [2] }}>Font Family</Text>
-        <input
-          sx={{
-            display: 'block',
-            fontFamily: 'body',
-            fontSize: [2],
-            width: ['100%', '100%', '35em'],
-            maxWidth: ['100%', '100%', '35em'],
-            borderRadius: 2,
-            padding: [2],
-            border: '1px solid',
-            borderColor: 'mediumGray'
-          }}
-          data-testid="theme-font-family"
-          placeholder='e.g., "Roboto, sans-serif"'
-          onBlur={(e) => handleStringValueChange('theme_font_family', e.target.value)}
-          onChange={(e) => handleConfigInputTyping('theme_font_family', e.target.value)}
-          value={conversationData.theme_font_family || ''}
-        />
-        <Text sx={{ fontSize: [0], color: 'textSecondary', mt: [1] }}>
-          Font family name (e.g., &quot;Roboto, sans-serif&quot;)
-        </Text>
-      </Box>
-
-      <Box sx={{ mb: [3] }}>
-        <Text sx={{ display: 'block', mb: [2] }}>Google Fonts URL (Optional)</Text>
-        <input
-          sx={{
-            display: 'block',
-            fontFamily: 'body',
-            fontSize: [2],
-            width: ['100%', '100%', '35em'],
-            maxWidth: ['100%', '100%', '35em'],
-            borderRadius: 2,
-            padding: [2],
-            border: '1px solid',
-            borderColor: 'mediumGray'
-          }}
-          data-testid="theme-google-fonts-url"
-          placeholder="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700"
-          onBlur={(e) => handleStringValueChange('theme_google_fonts_url', e.target.value)}
-          onChange={(e) => handleConfigInputTyping('theme_google_fonts_url', e.target.value)}
-          value={conversationData.theme_google_fonts_url || ''}
-        />
-        <Text sx={{ fontSize: [0], color: 'textSecondary', mt: [1] }}>
-          URL to load custom fonts from Google Fonts
-        </Text>
-      </Box>
-
-      <Box sx={{ mb: [3] }}>
-        <Text sx={{ display: 'block', mb: [2] }}>Hidden UI Elements</Text>
-        <input
-          sx={{
-            display: 'block',
-            fontFamily: 'body',
-            fontSize: [2],
-            width: ['100%', '100%', '35em'],
-            maxWidth: ['100%', '100%', '35em'],
-            borderRadius: 2,
-            padding: [2],
-            border: '1px solid',
-            borderColor: 'mediumGray'
-          }}
-          data-testid="theme-hide-elements"
-          placeholder='e.g., "footer,logo,help_text"'
-          onBlur={(e) => handleStringValueChange('theme_hide_elements', e.target.value)}
-          onChange={(e) => handleConfigInputTyping('theme_hide_elements', e.target.value)}
-          value={conversationData.theme_hide_elements || ''}
-        />
-        <Text sx={{ fontSize: [0], color: 'textSecondary', mt: [1] }}>
-          Comma-separated list of elements to hide. Options: footer, logo, help_text, stats,
-          visualization, comment_form, voting, donate_banner
-        </Text>
-      </Box>
     </Box>
   )
 }
diff --git a/client-participation/api/embed.js b/client-participation/api/embed.js
index 7918ac18..f92682c8 100644
--- a/client-participation/api/embed.js
+++ b/client-participation/api/embed.js
@@ -74,16 +74,7 @@
       // This is here in case we add other auth providers (Google, etc), you can preemptively disable them by setting this to false.
       auth_opt_allow_3rdparty: d.getAttribute("data-auth_opt_allow_3rdparty"), // default true
       dwok: d.getAttribute("data-dwok"),
-      topic: d.getAttribute("data-topic"),
-
-      // Theme customization (overrides conversation config)
-      theme_primary_color: d.getAttribute("data-theme_primary_color"),
-      theme_text_color: d.getAttribute("data-theme_text_color"),
-      theme_background_color: d.getAttribute("data-theme_background_color"),
-      theme_button_color: d.getAttribute("data-theme_button_color"),
-      theme_font_family: d.getAttribute("data-theme_font_family"),
-      theme_google_fonts_url: d.getAttribute("data-theme_google_fonts_url"),
-      hide_elements: d.getAttribute("data-hide_elements")
+      topic: d.getAttribute("data-topic")
     };
   }
 
@@ -152,15 +143,6 @@
 
     appendIfPresent("topic");
 
-    // Theme customization parameters
-    appendIfPresent("theme_primary_color");
-    appendIfPresent("theme_text_color");
-    appendIfPresent("theme_background_color");
-    appendIfPresent("theme_button_color");
-    appendIfPresent("theme_font_family");
-    appendIfPresent("theme_google_fonts_url");
-    appendIfPresent("hide_elements");
-
     if (paramStrings.length) {
       src += "?" + paramStrings.join("&");
     }
diff --git a/client-participation/api/embedPreprod.js b/client-participation/api/embedPreprod.js
index 28ced993..f8c720a1 100644
--- a/client-participation/api/embedPreprod.js
+++ b/client-participation/api/embedPreprod.js
@@ -74,16 +74,7 @@
       // This is here in case we add other auth providers (Google, etc), you can preemptively disable them by setting this to false.
       auth_opt_allow_3rdparty: d.getAttribute("data-auth_opt_allow_3rdparty"), // default true
       dwok: d.getAttribute("data-dwok"),
-      topic: d.getAttribute("data-topic"),
-
-      // Theme customization (overrides conversation config)
-      theme_primary_color: d.getAttribute("data-theme_primary_color"),
-      theme_text_color: d.getAttribute("data-theme_text_color"),
-      theme_background_color: d.getAttribute("data-theme_background_color"),
-      theme_button_color: d.getAttribute("data-theme_button_color"),
-      theme_font_family: d.getAttribute("data-theme_font_family"),
-      theme_google_fonts_url: d.getAttribute("data-theme_google_fonts_url"),
-      hide_elements: d.getAttribute("data-hide_elements")
+      topic: d.getAttribute("data-topic")
     };
   }
 
@@ -153,15 +144,6 @@
 
     appendIfPresent("topic");
 
-    // Theme customization parameters
-    appendIfPresent("theme_primary_color");
-    appendIfPresent("theme_text_color");
-    appendIfPresent("theme_background_color");
-    appendIfPresent("theme_button_color");
-    appendIfPresent("theme_font_family");
-    appendIfPresent("theme_google_fonts_url");
-    appendIfPresent("hide_elements");
-
     if (paramStrings.length) {
       src += "?" + paramStrings.join("&");
     }
diff --git a/client-participation/js/main.js b/client-participation/js/main.js
index bc99cb98..4e859658 100644
--- a/client-participation/js/main.js
+++ b/client-participation/js/main.js
@@ -5,7 +5,6 @@ var preloadHelper = require("./util/preloadHelper");
 
 var $ = require("jquery");
 var _ = require("lodash");
-var themeManager = require("./util/themeManager");
 
 require("../vis2/vis2"); // This is to initialise the 'window' object
 var Backbone = require("backbone");
@@ -292,14 +291,6 @@ uidPromise = CurrentUserModel.update();
 
 preloadHelper.firstConvPromise.then(
   function () {
-    // Apply theme customization if configured
-    try {
-      var conversationData = window.preload.firstConv || {};
-      var embedParams = Utils.decodeParams(encodedParams) || {};
-      themeManager.applyTheme(conversationData, embedParams);
-    } catch (themeError) {
-      console.error("[Main] Error applying theme:", themeError);
-    }
     PostMessageUtils.postInitEvent("ok");
   },
   function (error) {
diff --git a/client-participation/js/util/themeManager.js b/client-participation/js/util/themeManager.js
deleted file mode 100644
index 82f6420f..00000000
--- a/client-participation/js/util/themeManager.js
+++ /dev/null
@@ -1,213 +0,0 @@
-// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
-
-/**
- * Theme Manager
- * Applies theme customization from conversation config and embed parameters
- */
-
-// Map of element names to CSS selectors
-const HIDEABLE_ELEMENTS = {
-  footer: "[data-test-footer]",
-  logo: ".HeadingA img, #polis-donate img",
-  help_text: "#helpTextWelcome, #helpTextGroups",
-  stats: ".conversation-stats-header",
-  visualization: "#vis_section",
-  comment_form: "#commentFormParent",
-  voting: ".readReactView",
-  donate_banner: "#polis-donate",
-};
-
-/**
- * Load Google Fonts dynamically
- * @param {string} url - Google Fonts URL
- */
-function loadGoogleFonts(url) {
-  if (!url || typeof url !== "string") {
-    return;
-  }
-
-  // Check if the URL is already loaded
-  const existingLink = document.querySelector(`link[href="${url}"]`);
-  if (existingLink) {
-    return;
-  }
-
-  const link = document.createElement("link");
-  link.rel = "stylesheet";
-  link.href = url;
-  document.head.appendChild(link);
-}
-
-/**
- * Apply CSS custom properties for theming
- * @param {object} themeConfig - Theme configuration object
- */
-function applyThemeColors(themeConfig) {
-  if (!themeConfig) {
-    return;
-  }
-
-  const style = document.createElement("style");
-  style.id = "polis-theme-colors";
-
-  let css = ":root {\n";
-
-  if (themeConfig.theme_primary_color) {
-    css += `  --theme-primary-color: ${themeConfig.theme_primary_color};\n`;
-  }
-
-  if (themeConfig.theme_text_color) {
-    css += `  --theme-text-color: ${themeConfig.theme_text_color};\n`;
-  }
-
-  if (themeConfig.theme_background_color) {
-    css += `  --theme-background-color: ${themeConfig.theme_background_color};\n`;
-  }
-
-  if (themeConfig.theme_button_color) {
-    css += `  --theme-button-color: ${themeConfig.theme_button_color};\n`;
-  }
-
-  if (themeConfig.theme_font_family) {
-    css += `  --theme-font-family: ${themeConfig.theme_font_family};\n`;
-  }
-
-  css += "}\n\n";
-
-  // Apply the CSS custom properties to actual elements
-  if (themeConfig.theme_primary_color) {
-    css += `
-a,
-.HeadingC,
-.Btn-alt {
-  color: var(--theme-primary-color) !important;
-}
-`;
-  }
-
-  if (themeConfig.theme_text_color) {
-    css += `
-body,
-.participationView,
-p,
-.HeadingA {
-  color: var(--theme-text-color) !important;
-}
-`;
-  }
-
-  if (themeConfig.theme_background_color) {
-    css += `
-body,
-.participationView,
-.conversationViewRoot {
-  background-color: var(--theme-background-color) !important;
-}
-`;
-  }
-
-  if (themeConfig.theme_button_color) {
-    css += `
-.Btn,
-button[type="submit"] {
-  background-color: var(--theme-button-color) !important;
-}
-`;
-  }
-
-  if (themeConfig.theme_font_family) {
-    css += `
-body,
-.participationView,
-p,
-.HeadingA,
-.HeadingC,
-input,
-textarea {
-  font-family: var(--theme-font-family) !important;
-}
-`;
-  }
-
-  style.innerHTML = css;
-  document.head.appendChild(style);
-}
-
-/**
- * Hide UI elements based on configuration
- * @param {string} hideElementsConfig - Comma-separated list of elements to hide
- */
-function hideElements(hideElementsConfig) {
-  if (!hideElementsConfig || typeof hideElementsConfig !== "string") {
-    return;
-  }
-
-  const elementsToHide = hideElementsConfig
-    .split(",")
-    .map((e) => e.trim())
-    .filter((e) => e.length > 0);
-
-  elementsToHide.forEach(function (elementKey) {
-    const selector = HIDEABLE_ELEMENTS[elementKey];
-    if (selector) {
-      // Try to hide immediately
-      const elements = document.querySelectorAll(selector);
-      elements.forEach(function (el) {
-        el.style.display = "none";
-        el.classList.add("displayNone");
-      });
-
-      // Also add a CSS rule to catch elements that load later
-      const style = document.createElement("style");
-      style.innerHTML = selector + " { display: none !important; }";
-      document.head.appendChild(style);
-    }
-  });
-}
-
-/**
- * Apply theme configuration
- * @param {object} conversationData - Conversation data including theme fields
- * @param {object} embedParams - Parameters from embed.js (can override conversation config)
- */
-function applyTheme(conversationData, embedParams) {
-  // Merge configuration: embed params override conversation config
-  const themeConfig = {
-    theme_primary_color:
-      embedParams.theme_primary_color || conversationData.theme_primary_color,
-    theme_text_color:
-      embedParams.theme_text_color || conversationData.theme_text_color,
-    theme_background_color:
-      embedParams.theme_background_color ||
-      conversationData.theme_background_color,
-    theme_button_color:
-      embedParams.theme_button_color || conversationData.theme_button_color,
-    theme_font_family:
-      embedParams.theme_font_family || conversationData.theme_font_family,
-    theme_google_fonts_url:
-      embedParams.theme_google_fonts_url ||
-      conversationData.theme_google_fonts_url,
-    theme_hide_elements:
-      embedParams.hide_elements || conversationData.theme_hide_elements,
-  };
-
-  // Load Google Fonts if specified
-  if (themeConfig.theme_google_fonts_url) {
-    loadGoogleFonts(themeConfig.theme_google_fonts_url);
-  }
-
-  // Apply colors and fonts
-  applyThemeColors(themeConfig);
-
-  // Hide elements
-  if (themeConfig.theme_hide_elements) {
-    hideElements(themeConfig.theme_hide_elements);
-  }
-}
-
-module.exports = {
-  applyTheme: applyTheme,
-  loadGoogleFonts: loadGoogleFonts,
-  applyThemeColors: applyThemeColors,
-  hideElements: hideElements,
-};
diff --git a/server/package-lock.json b/server/package-lock.json
index 66ee1859..2048bf35 100644
--- a/server/package-lock.json
+++ b/server/package-lock.json
@@ -2327,7 +2327,6 @@
       "version": "7.27.1",
       "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.27.1.tgz",
       "integrity": "sha512-IaaGWsQqfsQWVLqMn9OB92MNN7zukfVA4s7KKAI0KfrrDsZ0yhi5uV4baBuLuN7n3vsZpwP8asPPcVwApxvjBQ==",
-      "peer": true,
       "dependencies": {
         "@ampproject/remapping": "^2.2.0",
         "@babel/code-frame": "^7.27.1",
@@ -4790,7 +4789,6 @@
       "resolved": "https://registry.npmjs.org/@opentelemetry/api/-/api-1.8.0.tgz",
       "integrity": "sha512-I/s6F7yKUDdtMsoBWXJe8Qz40Tui5vsuKCWJEWVL+5q9sSWRzzx6v2KeNsOBEwd94j0eWkpWCH4yB6rZg9Mf0w==",
       "license": "Apache-2.0",
-      "peer": true,
       "engines": {
         "node": ">=8.0.0"
       }
@@ -6117,7 +6115,6 @@
       "resolved": "https://registry.npmjs.org/@types/node/-/node-22.15.34.tgz",
       "integrity": "sha512-8Y6E5WUupYy1Dd0II32BsWAx5MWdcnRd8L84Oys3veg1YrYtNtzgO4CFhiBg6MDSjk7Ay36HYOnU7/tuOzIzcw==",
       "license": "MIT",
-      "peer": true,
       "dependencies": {
         "undici-types": "~6.21.0"
       }
@@ -6389,7 +6386,6 @@
       "resolved": "https://registry.npmjs.org/@typescript-eslint/parser/-/parser-5.62.0.tgz",
       "integrity": "sha512-VlJEV0fOQ7BExOsHYAGrgbEiZoi8D+Bl2+f6V2RrXerRSylnp+ZBHmPvaIa8cz0Ajx7WO7Z5RqfgYg7ED1nRhA==",
       "dev": true,
-      "peer": true,
       "dependencies": {
         "@typescript-eslint/scope-manager": "5.62.0",
         "@typescript-eslint/types": "5.62.0",
@@ -6603,7 +6599,6 @@
       "version": "8.14.1",
       "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.14.1.tgz",
       "integrity": "sha512-OvQ/2pUDKmgfCg++xsTX1wGxfTaszcHVcTctW4UJB4hibJx2HXxxO5UmVgyjMa+ZDsiaf5wWLXYpRWMmBI0QHg==",
-      "peer": true,
       "bin": {
         "acorn": "bin/acorn"
       },
@@ -7198,7 +7193,6 @@
           "url": "https://github.com/sponsors/ai"
         }
       ],
-      "peer": true,
       "dependencies": {
         "caniuse-lite": "^1.0.30001688",
         "electron-to-chromium": "^1.5.73",
@@ -8570,7 +8564,6 @@
       "resolved": "https://registry.npmjs.org/eslint/-/eslint-8.57.1.tgz",
       "integrity": "sha512-ypowyDxpVSYpkXr9WPv2PAZCtNip1Mv5KTW0SCurXv/9iOpcrH9PaqUElksqEB6pChqHGDRCFTyrZlGhnLNGiA==",
       "deprecated": "This version is no longer supported. Please see https://eslint.org/version-support for other options.",
-      "peer": true,
       "dependencies": {
         "@eslint-community/eslint-utils": "^4.2.0",
         "@eslint-community/regexpp": "^4.6.1",
@@ -10393,7 +10386,6 @@
       "resolved": "https://registry.npmjs.org/jest/-/jest-29.7.0.tgz",
       "integrity": "sha512-NIy3oAFp9shda19hy4HK0HRTWKtPJmGdnvywu01nOqNC2vZg+Z+fvJDxpMQA88eb2I9EcafcdjYgsDthnYTvGw==",
       "dev": true,
-      "peer": true,
       "dependencies": {
         "@jest/core": "^29.7.0",
         "@jest/types": "^29.6.3",
@@ -11012,7 +11004,6 @@
       "resolved": "https://registry.npmjs.org/jsep/-/jsep-1.4.0.tgz",
       "integrity": "sha512-B7qPcEVE3NVkmSJbaYxvv4cHkVW7DQsZz13pUMrfS8z8Q/BuShN+gcTXrUlPiGqM2/t/EEaI030bpxMqY8gMlw==",
       "license": "MIT",
-      "peer": true,
       "engines": {
         "node": ">= 10.16.0"
       }
@@ -12277,7 +12268,6 @@
       "resolved": "https://registry.npmjs.org/pg/-/pg-8.16.3.tgz",
       "integrity": "sha512-enxc1h0jA/aq5oSDMvqyW3q89ra6XIIDZgCX9vkMrnz5DFTw/Ny3Li2lFQ+pt3L6MCgm/5o2o8HW9hiJji+xvw==",
       "license": "MIT",
-      "peer": true,
       "dependencies": {
         "pg-connection-string": "^2.9.1",
         "pg-pool": "^3.10.1",
@@ -12866,7 +12856,6 @@
       "resolved": "https://registry.npmjs.org/request/-/request-2.88.2.tgz",
       "integrity": "sha512-MsvtOrfG9ZcrOwAW+Qi+F6HbD0CWXEh9ou77uOb7FM2WPhwT7smM833PzanhJLsgXjN89Ir6V2PczXNnMpwKhw==",
       "deprecated": "request has been deprecated, see https://github.com/request/request/issues/3142",
-      "peer": true,
       "dependencies": {
         "aws-sign2": "~0.7.0",
         "aws4": "^1.8.0",
@@ -14420,7 +14409,6 @@
       "version": "5.8.3",
       "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.8.3.tgz",
       "integrity": "sha512-p1diW6TqL9L07nNxvRMM7hMMw4c5XOo/1ibL4aAIGmSAt9slTE1Xgw5KWuof2uTOvCg9BY7ZRi+GaF+7sfgPeQ==",
-      "peer": true,
       "bin": {
         "tsc": "bin/tsc",
         "tsserver": "bin/tsserver"
@@ -14941,7 +14929,6 @@
       "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.50.tgz",
       "integrity": "sha512-VstOnRxf4tlSq0raIwbn0n+LA34SxVoZ8r3pkwSUM0jqNiA/HCMQEVjTuS5FZmHsge+9MDGTiAuHyml5T0um6A==",
       "license": "MIT",
-      "peer": true,
       "funding": {
         "url": "https://github.com/sponsors/colinhacks"
       }
diff --git a/server/postgres/migrations/000015_add_theme_customization_fields.sql b/server/postgres/migrations/000015_add_theme_customization_fields.sql
deleted file mode 100644
index 60a69411..00000000
--- a/server/postgres/migrations/000015_add_theme_customization_fields.sql
+++ /dev/null
@@ -1,28 +0,0 @@
--- Migration: Add theme customization fields to conversations table
--- Allows conversation owners to customize colors, fonts, and hide UI elements
-
--- Add theme color fields
-ALTER TABLE conversations
-  ADD COLUMN IF NOT EXISTS theme_primary_color VARCHAR(20),
-  ADD COLUMN IF NOT EXISTS theme_text_color VARCHAR(20),
-  ADD COLUMN IF NOT EXISTS theme_background_color VARCHAR(20),
-  ADD COLUMN IF NOT EXISTS theme_button_color VARCHAR(20);
-
--- Add typography fields
-ALTER TABLE conversations
-  ADD COLUMN IF NOT EXISTS theme_font_family VARCHAR(200),
-  ADD COLUMN IF NOT EXISTS theme_google_fonts_url VARCHAR(500);
-
--- Add element visibility control (JSON array of element names to hide)
--- Example: ["footer", "logo", "help_text", "stats"]
-ALTER TABLE conversations
-  ADD COLUMN IF NOT EXISTS theme_hide_elements TEXT;
-
--- Add comments for documentation
-COMMENT ON COLUMN conversations.theme_primary_color IS 'Primary brand color (hex format: #03a9f4)';
-COMMENT ON COLUMN conversations.theme_text_color IS 'Main text color (hex format)';
-COMMENT ON COLUMN conversations.theme_background_color IS 'Background color (hex format)';
-COMMENT ON COLUMN conversations.theme_button_color IS 'Button/action color (hex format)';
-COMMENT ON COLUMN conversations.theme_font_family IS 'Font family name (e.g., "Roboto, sans-serif")';
-COMMENT ON COLUMN conversations.theme_google_fonts_url IS 'Optional Google Fonts URL to load custom fonts';
-COMMENT ON COLUMN conversations.theme_hide_elements IS 'Comma-separated list of UI elements to hide (e.g., "footer,logo,help_text")';
diff --git a/server/src/d.ts b/server/src/d.ts
index 702772eb..4cdf770d 100644
--- a/server/src/d.ts
+++ b/server/src/d.ts
@@ -173,14 +173,6 @@ export interface ConversationInfo {
   auth_opt_allow_3rdparty?: boolean;
   created?: number;
   modified?: number;
-  // Theme customization fields
-  theme_primary_color?: string;
-  theme_text_color?: string;
-  theme_background_color?: string;
-  theme_button_color?: string;
-  theme_font_family?: string;
-  theme_google_fonts_url?: string;
-  theme_hide_elements?: string;
   [key: string]: any;
 }
 
@@ -259,14 +251,6 @@ export type ConversationType = {
   limit?: number;
   parent_url?: string;
   auth_opt_allow_3rdparty?: boolean;
-  // Theme customization fields
-  theme_primary_color?: string;
-  theme_text_color?: string;
-  theme_background_color?: string;
-  theme_button_color?: string;
-  theme_font_family?: string;
-  theme_google_fonts_url?: string;
-  theme_hide_elements?: string;
 };
 
 export type ParticipantOption = {
diff --git a/server/src/db/sql.ts b/server/src/db/sql.ts
index 607332d4..5cb97859 100644
--- a/server/src/db/sql.ts
+++ b/server/src/db/sql.ts
@@ -40,13 +40,6 @@ const sql_conversations: any = sql.define({
     "auth_needed_to_write",
     "auth_opt_allow_3rdparty",
     "treevite_enabled",
-    "theme_primary_color",
-    "theme_text_color",
-    "theme_background_color",
-    "theme_button_color",
-    "theme_font_family",
-    "theme_google_fonts_url",
-    "theme_hide_elements",
   ],
 });
 
diff --git a/server/src/routes/conversations.ts b/server/src/routes/conversations.ts
index 0b57b442..9ddfc697 100644
--- a/server/src/routes/conversations.ts
+++ b/server/src/routes/conversations.ts
@@ -864,56 +864,6 @@ function handle_PUT_conversations(
         fields.link_url = req.p.link_url;
       }
 
-      // Theme customization fields
-      // Try to get from either req.p or req.body (depending on middleware setup)
-      const getField = (field: string) => {
-        return !_.isUndefined((req.p as any)[field])
-          ? (req.p as any)[field]
-          : !_.isUndefined((req.body as any)[field])
-            ? (req.body as any)[field]
-            : undefined;
-      };
-
-      logger.info('[Theme Debug] req.p keys:', Object.keys(req.p));
-      logger.info('[Theme Debug] req.body keys:', req.body ? Object.keys(req.body) : 'no body');
-      logger.info('[Theme Debug] theme_primary_color value:', getField('theme_primary_color'));
-
-      const themePrimaryColor = getField('theme_primary_color');
-      if (!_.isUndefined(themePrimaryColor)) {
-        logger.info('[Theme Debug] Setting theme_primary_color to:', themePrimaryColor);
-        (fields as any).theme_primary_color = themePrimaryColor;
-      }
-
-      const themeTextColor = getField('theme_text_color');
-      if (!_.isUndefined(themeTextColor)) {
-        (fields as any).theme_text_color = themeTextColor;
-      }
-
-      const themeBackgroundColor = getField('theme_background_color');
-      if (!_.isUndefined(themeBackgroundColor)) {
-        (fields as any).theme_background_color = themeBackgroundColor;
-      }
-
-      const themeButtonColor = getField('theme_button_color');
-      if (!_.isUndefined(themeButtonColor)) {
-        (fields as any).theme_button_color = themeButtonColor;
-      }
-
-      const themeFontFamily = getField('theme_font_family');
-      if (!_.isUndefined(themeFontFamily)) {
-        (fields as any).theme_font_family = themeFontFamily;
-      }
-
-      const themeGoogleFontsUrl = getField('theme_google_fonts_url');
-      if (!_.isUndefined(themeGoogleFontsUrl)) {
-        (fields as any).theme_google_fonts_url = themeGoogleFontsUrl;
-      }
-
-      const themeHideElements = getField('theme_hide_elements');
-      if (!_.isUndefined(themeHideElements)) {
-        (fields as any).theme_hide_elements = themeHideElements;
-      }
-
       ifDefinedSet("subscribe_type", req.p, fields);
 
       const q = sql_conversations
