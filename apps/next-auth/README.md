# Overview

Expense manager example for Audit logs with next-auth.

This is an example application that shows how [`Audit logs`](https://github.com/retracedhq/retraced) and `next-auth` is applied to a basic Next.js app.

## Expense Manager

The example has following roles,

1. Admin
2. Manager
3. Viewer

When you click on `Login` button app redirects to `https://mocksaml.com/` and asks for email.

You can enter `Admin` or `Manager` or `Viewer` as email to use those roles.

If you enter anything other than above roles that user will be considered as `Viewer`.

- Only Admin can see the Audit logs.
- Manager & Admin can make changes to the expenses.
- Viewer can only see the expenses.

## Getting Started

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/boxyhq/retraced-examples
npm install
cd apps/next-auth
```

### 2. Start the application

To run your site locally, use:

```bash
npm run dev
```

To run it in production mode, use:

```bash
npm run build
npm run start
```

## License

Apache 2.0
