# Overview

B2B Trading example for Audit logs with next-auth.

This is an example application that shows how [`Audit logs`](https://github.com/retracedhq/retraced) and `next-auth` is applied to a basic Next.js app.

## B2B Trading

When you click on `Login` button app redirects to `https://mocksaml.com/` and asks for email.

You can see the `bids` and `offers` on the left bottom section.
You can create an `order` using the form in the left section.
Once you create an order you will see order `creation log` on the Audit logs section on the right side.
You can `simulate an error` and see how audit logs catches it and shows it.
You can click on `Open logs viewer` to open the logs viewer in new tab and see detailed log info and filter on it.

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
