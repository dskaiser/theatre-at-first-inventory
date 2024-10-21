# Theatre@First
Below are instructions on how to run our codebase on your machine. Check out
[`resources.md`](./resources.md) for more general info and tutorials on some of the technologies
we'll be using this year.

## Environment Setup
For local development, it's recommended to utilize a [devcontainer](https://code.visualstudio.com/docs/devcontainers/tutorial), or [codespace](https://code.visualstudio.com/docs/remote/codespaces).

1. Create a `.env.local` file. You can use the [`.env.local.example`](./.env.local.example) as a starting point.
2. Fill in the enviroment variables as desired.
  - `DRIZZLE_DATABASE_URL` - If not using a codespace/devcontainer you'll need to setup a postgresql server locally, and update this to match your db. The connection url should follow the format `postgres://<role>:<password>@<hostname>/database`
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` - These should be copied from the environment variables of an application you setup in [Clerk](http://clerk.com/). There's not currently a recommended way to run this locally without a clerk app.

## Running the Dev Server
After pulling the code from this repository, getting up and running for
development is pretty simple.
1. First, you need to install the project's dependencies. You can do this by
running `pnpm install` in the project directory.
2. Start the development server by running `pnpm dev`. The output of this
command will tell you which port your computer is hosting the project on.
Typically, you will find it at `http://localhost:3000`.
