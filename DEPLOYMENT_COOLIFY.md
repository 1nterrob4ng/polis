  Step-by-Step Deployment Guide for Polis on Coolify

  1. Prepare Your Repository

  - Ensure your Polis fork is in a Git repository (GitHub, GitLab, etc.)
  - Make sure your repository is accessible to Coolify

  2. Create a New Project in Coolify

  - Log into your Coolify dashboard
  - Click "New Project" or "Add Resource"
  - Select "Docker Compose" as the deployment type
  - Connect your Git repository (use GitHub App for private repos, or public repo URL)

  3. Configure Git Settings

  - Repository: Point to your polis-fork repository
  - Branch: Select theatre (or your main branch)
  - Base Directory: Leave empty (root of repo)
  - Docker Compose File: docker-compose.yml

  4. Set Up Environment Variables

  In Coolify, configure these essential environment variables based on example.env:

  Database (Critical):
  POSTGRES_DB=polis-prod
  POSTGRES_USER=postgres
  POSTGRES_PASSWORD=<generate-secure-password>
  DATABASE_URL=postgres://postgres:<password>@postgres:5432/polis-prod
  POSTGRES_DOCKER=true
  DATABASE_SSL=false

  Domain & Hosting:
  DEV_MODE=false
  API_PROD_HOSTNAME=<your-domain.com>
  DOMAIN_OVERRIDE=<your-domain.com>
  EMBED_SERVICE_HOSTNAME=<your-domain.com>
  HTTP_PORT=80
  HTTPS_PORT=443

  OIDC Authentication (Required):
  AUTH_AUDIENCE=users
  AUTH_CLIENT_ID=<your-client-id>
  AUTH_CLIENT_SECRET=<generate-secure-secret>
  AUTH_ISSUER=https://<your-domain.com>/
  AUTH_NAMESPACE=https://<your-domain.com>/
  POLIS_JWT_AUDIENCE=participants
  POLIS_JWT_ISSUER=https://<your-domain.com>/
  LOGIN_CODE_PEPPER=<generate-random-string>

  JWT Keys (Generate locally first):
  # Run locally: make generate-jwt-keys
  # Then base64 encode them for production:
  JWT_PRIVATE_KEY=<base64-encoded-private-key>
  JWT_PUBLIC_KEY=<base64-encoded-public-key>

  Email Configuration:
  POLIS_FROM_ADDRESS="Your Team <noreply@your-domain.com>"

  AWS/Storage (if using real AWS, otherwise omit for local-services profile):
  AWS_REGION=us-east-1
  AWS_ACCESS_KEY_ID=<your-key>
  AWS_SECRET_ACCESS_KEY=<your-secret>
  AWS_S3_BUCKET_NAME=<your-bucket>

  Optional Services:
  AKISMET_ANTISPAM_API_KEY=<if-using-spam-protection>
  GA_TRACKING_ID=<if-using-analytics>
  ANTHROPIC_API_KEY=<if-using-AI-features>

  5. Configure Docker Compose Profiles

  For production deployment, you'll want to run with the postgres profile:

  In Coolify's advanced settings, set the Docker Compose command to:
  docker compose --profile postgres up -d

  Note: For production, you may want to:
  - Omit --profile local-services (uses real AWS S3, DynamoDB instead of MinIO/local)
  - Include --profile prod if you want Datadog monitoring

  6. Configure Persistent Storage

  Ensure Coolify creates volumes for:
  - postgres_data - Database persistence
  - server-logs - Server logs
  - ollama-models - AI models (if using Ollama)
  - minio_data - Local file storage (if using MinIO)
  - dynamodb-data - Local DynamoDB (if using local-services)

  7. Set Up Domain & SSL

  In Coolify:
  - Domain: Add your custom domain (e.g., polis.yourdomain.com)
  - Force HTTPS: Enable
  - Auto Deploy: Enable (optional, for automatic deployments on git push)
  - Coolify will automatically provision SSL certificates via Let's Encrypt

  8. Port Configuration

  Configure these port mappings in Coolify:
  - 80:80 (HTTP - nginx-proxy)
  - 443:443 (HTTPS - nginx-proxy)

  Other services don't need external port exposure as they communicate internally via polis-net network.

  9. Resource Limits

  Set appropriate resource limits (adjust based on your server):
  - Delphi: 16GB RAM, 2 CPUs (already configured in docker-compose.yml)
  - Server: 2GB RAM recommended
  - Math: 4GB RAM recommended
  - Postgres: 4GB RAM recommended

  10. Deploy

  1. Click "Deploy" in Coolify
  2. Monitor the build logs for any errors
  3. Wait for all services to start (may take 5-10 minutes on first deployment)

  11. Post-Deployment Steps

  a) Run Database Migrations:
  The postgres container with Dockerfile-db automatically runs migrations, but verify:
  # In Coolify's terminal/shell for postgres container:
  # Check that migrations ran successfully

  b) Create Admin User:
  Visit https://your-domain.com/createuser to create your first admin account.

  c) Health Checks:
  - Visit https://your-domain.com to verify the site loads
  - Check service logs in Coolify for any errors
  - Test creating a conversation and adding comments

  12. Configure External Services (Production)

  For production use, configure:

  Email (SES/SMTP):
  # For AWS SES:
  AWS_REGION=us-east-1
  # Remove SES_ENDPOINT (only for local dev)

  S3 Storage:
  # Remove AWS_S3_ENDPOINT (uses real AWS S3)
  AWS_S3_BUCKET_NAME=your-production-bucket

  DynamoDB:
  # Remove DYNAMODB_ENDPOINT (uses real AWS DynamoDB)

  13. Monitoring & Maintenance

  - Enable Auto Deploy for automatic deployments on git push
  - Set up Backups for postgres volume in Coolify
  - Monitor Resource Usage in Coolify dashboard
  - Check Logs regularly for errors

  14. Rollback Capability

  Coolify provides easy rollback:
  - Go to your deployment in Coolify
  - Click "Deployments" history
  - Select a previous successful deployment to rollback

  ---
  Production Checklist

  Before going live:
  - Generate secure passwords for all credentials
  - Configure production domain and SSL
  - Set up real AWS services (S3, DynamoDB, SES)
  - Configure database backups
  - Test email delivery
  - Set DEV_MODE=false
  - Configure monitoring (Datadog optional)
  - Test conversation creation and voting
  - Set up proper OIDC provider (not simulator)

> step 4, where would I run the make command?

⏺ Run the make generate-jwt-keys command locally on your machine where you have the repository cloned (/YOUR_USER_PATH/polis-fork).

  Here's the workflow:

  # 1. In your local repository directory:
  cd /YOUR_USER_PATH/polis-fork
  make generate-jwt-keys

  This creates:
  - server/keys/jwt-private.pem
  - server/keys/jwt-public.pem

  # 2. Then base64-encode them for production environment variables:
  cat server/keys/jwt-private.pem | base64
  cat server/keys/jwt-public.pem | base64

  # 3. Copy the base64 output and add to Coolify environment variables:
  JWT_PRIVATE_KEY=<paste-base64-private-key-here>
  JWT_PUBLIC_KEY=<paste-base64-public-key-here>

  Important:
  - Don't commit these keys to git (they should be in .gitignore)
  - Store them securely (password manager, secrets vault)
  - In Coolify, use the base64-encoded versions as environment variables
  - The Docker containers will decode them at runtime

  Alternative: If the make command doesn't exist, you can generate RSA keys manually:

  mkdir -p server/keys
  openssl genrsa -out server/keys/jwt-private.pem 2048
  openssl rsa -in server/keys/jwt-private.pem -pubout -out server/keys/jwt-public.pem

> and then I send them to the server that runs coolify?

⏺ No, you don't send files to the Coolify server.

  Instead, you paste the base64-encoded strings as environment variables in Coolify's web interface. Here's the exact workflow:

  Complete Process:

  1. Generate Keys Locally

  cd /YOUR_USER_PATH/polis-fork
  make generate-jwt-keys

  2. Base64 Encode Them

  # macOS:
  cat server/keys/jwt-private.pem | base64

  cat server/keys/jwt-public.pem | base64

  3. Add to Coolify (via Web UI)

  1. Go to your Coolify dashboard
  2. Navigate to your Polis project → Environment Variables
  3. Add these two variables:
    - Key: JWT_PRIVATE_KEYValue: <paste-the-base64-encoded-private-key>
    - Key: JWT_PUBLIC_KEYValue: <paste-the-base64-encoded-public-key>

  4. How It Works

  When the Docker containers start, the Polis server will:
  - Read these environment variables
  - Decode the base64 strings
  - Write them to files inside the container at /app/keys/jwt-private.pem and /app/keys/jwt-public.pem

  You never manually copy files to the Coolify server - everything is managed through environment variables in the Coolify interface.