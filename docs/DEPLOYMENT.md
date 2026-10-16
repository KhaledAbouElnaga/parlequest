# Deploying the existing ParleQuest site from GitHub

Live URL: https://parlequest.pages.dev/

The existing `parlequest` Cloudflare Pages project was created with Direct Upload. Cloudflare does not convert Direct Upload projects into native Git-integrated projects. To preserve the same URL, this repository uses GitHub Actions and Wrangler, as described in [Cloudflare’s CI guide](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).

## Repository workflow

`.github/workflows/ci.yml` builds and tests pushes to `main`, pull requests and manual runs. It only deploys if the repository variable `CLOUDFLARE_DEPLOY_ENABLED` is exactly `true`, and only after verification succeeds on `main`. Pull requests never receive production credentials.

## One-time configuration

1. In the relevant Cloudflare account, create an API token with Account → Cloudflare Pages → Edit, restricted to the intended account. This grants deployment access and must be approved by the account owner. Do not use a global API key.
2. In this GitHub repository, add two **Actions secrets**:
   - `CLOUDFLARE_API_TOKEN`: the restricted token.
   - `CLOUDFLARE_ACCOUNT_ID`: the account containing the existing `parlequest` project.
3. Add the **Actions variable** `CLOUDFLARE_DEPLOY_ENABLED` with value `true`.
4. Run **Verify and deploy** from the Actions tab, or push a reviewed change to `main`.
5. Verify both the workflow’s success and the live site before announcing an update.

Do not store tokens in `.env`, source files, screenshots, issues or commits. The account ID is configuration; the API token is a secret. Keep token values out of the public repository even though the app itself requires no API key.

## Current status

Production automation is **active**. Both repository secrets and the enable variable are configured. Build/test and production deployment succeeded on 16 October 2026: [verified run](https://github.com/KhaledAbouElnaga/parlequest/actions/runs/38924395282). The account-restricted Pages Edit token expires on **14 January 2027** (90 days). Before expiry, create a replacement with the same scope, update the CLOUDFLARE_API_TOKEN Actions secret, verify a deployment, then revoke the old token. Expiry stops future deployments; it does not take down the already published site.

## Future development

Create a branch, implement the change, run `npm run build` and `npm test`, review a pull request, then merge to `main`. Once production automation has been enabled, a successful main build updates the existing site. LinkedIn is for showcasing the project and announcing releases; it is not a source-code deployment service.

