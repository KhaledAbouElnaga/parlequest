# Private access deployment

The Pages advanced-mode worker (`server/worker.mjs`) authorizes **every** route before forwarding app HTML, scripts or exercise bundles to `ASSETS`. Only the login/request/activation UI, icons, manifest and cache-retirement worker are public. Unconfigured auth fails closed (503). Missing credentials redirect document navigation to `/login` and deny raw bundles with 401.

## Provisioning

1. Create a dedicated D1 database and apply `server/schema.sql`.
2. Bind it as `AUTH_DB` on the existing Pages project, for production and previews.
3. Generate a random 32-byte `AUTH_PEPPER` and store it as a **Cloudflare encrypted secret**. Do not put it in GitHub, screenshots or source. Preserve it: changing it invalidates all existing password hashes.
4. Insert the owner and approved initial students using random UUIDs, status `approved`, `password_hash=NULL`, a SHA-256 digest of each random 32-byte activation token, and a 24-hour `invite_expires` timestamp. Store real identities and invitation material outside public source. No plaintext production passwords are created by the developer.
5. Share single-use `/activate#TOKEN` links privately with the account owner. The person enters their own password (12–128 characters) directly in the browser. The server uses a random salt and PBKDF2-SHA256 over an HMAC-peppered password. Invitation tokens are hashed at rest, consumed atomically and not included in request URLs or referrers.
6. Deploy using the existing GitHub workflow. Test anonymous denial, login, role checks and session revocation. No paid service or mail delivery is required for username/password accounts. These usernames do not create actual mailboxes.
7. Delete older public deployments after explicit owner confirmation and after the protected deployment passes live checks. Otherwise immutable old deployment URLs remain an alternate public entry. Never roll back to a version without the authorization worker.

## Roles and requests

New registrations are always `student` + `pending`; no public form can choose its role or approval status. A request cannot overwrite an existing user. Administrators can approve, reject, suspend, create single-use student invitations and reset student credentials. Administrators cannot reset or suspend the owner through the student-management API. Approval requests are viewed in `/admin`; no automated email notifications are sent.

Sessions are random server-side credentials, stored as hashes in D1, with 12-hour HttpOnly/Secure/SameSite=Strict host-only cookies. Every protected request joins the session to the user's current approval status. Logout, suspension, rejection and password changes revoke sessions. Write requests enforce same-origin JSON and bounded request bodies. Login, activation, requests and password updates have D1-backed rate limits. User content is rendered with `textContent`, not HTML interpolation.

## Offline, history and local progress

Private access requires connectivity. The old cache-first PWA worker is retired and its `pq-` caches are removed when a client reconnects. Authenticated responses are `no-store`. A previously downloaded public copy cannot be remotely erased before it reconnects, and the previously public source repository still contains historical content. This gate controls the hosted service; it cannot undo prior distribution.

New progress is namespaced by authenticated user ID on the device. Old anonymous browser progress is left intact but not silently assigned to another account. There is no automatic cross-device progress sync.

## Recovery and operations

The owner can change their password while signed in. If the owner loses their password, use the authenticated Cloudflare D1 console to revoke sessions and issue a fresh one-time owner activation token; do not create an unauthenticated recovery endpoint or claim email delivery exists. Clean up expired sessions/rate-limit entries periodically. Keep the D1 database and pepper when redeploying. Use only the existing free plan; when free quotas are exhausted, do not enable billing automatically.

The legacy public/offline user guide predates this change and must be updated before redistribution.
