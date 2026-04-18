### 1. `coolify-proxy/` (Deno + Hono API)

```
cd coolify-proxy
deno task dev
```

### 2. `coolify-proxy-manage-user/` (Next.js)

```
cd coolify-proxy-manage-user
pnpm dev
```

### 3. `cws-user-panel/` (Next.js)

```
cd cws-user-panel
pnpm dev
```

Make sure each folder has a `.env` file configured (you can copy from `.env.example` if needed).

# coolify-test-todo-app

1. When creating an app, enter a webhook secret in the "GitHub Webhook Secret" field under Advanced Settings
2. In your GitHub repo, go to Settings > Webhooks > Add webhook
3. Set the Payload URL to your Coolify instance's webhook endpoint (typically
   https://<your-coolify-domain>/webhooks/github/events/manual)
4. Set Content type to application/json
5. Set Secret to the same secret you entered in step 1
6. Select Just the push event

---

It's simple — `cws-user-panel` only has **one env var**:

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

This points to your **`coolify-proxy` backend**. The domain comes from whatever domain you assign to the `coolify-proxy` service when you deploy it in Coolify.

So the flow is:

1. Deploy `coolify-proxy` on Coolify → assign it a domain (e.g. `api.yourdomain.com`)
2. Deploy `cws-user-panel` on Coolify → set `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`

You choose the domain yourself — either a subdomain of a domain you own, or Coolify can give you one automatically.
