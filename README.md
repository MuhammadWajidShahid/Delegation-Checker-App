# Delegations App

An app built using remix which allows user to login/signup/connect keplr and view their delegations on cosmos hub network.

# How to get it running locally

## Development

- Start the Postgres Database in [Docker](https://www.docker.com/get-started):

  ```sh
  npm run docker
  ```

  > **Note:** The npm script will complete while Docker sets up the container in the background. Ensure that Docker has finished and your container is running before proceeding.

- Initial setup:

  ```sh
  npm run setup
  ```

- Setup Environment vairables:

Create a `.env` file and set the environment variables

```
DATABASE_URL="postgres url. can be found in .env.example"
SESSION_SECRET="secret to hash the session"
COSMOS_RPC_URL="place your cosmos hub mainnet rpc"
```

- Run the first build:

  ```sh
  npm run build
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `rachel@remix.run`
- Password: `racheliscool`

