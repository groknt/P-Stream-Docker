# P-Stream Docker

## Pre-configured all-in-one docker compose configuration for P-Stream.

> **For an optimal experience,** install the [P-Stream Userscript](https://github.com/groknt/P-Stream-Userscript) **or** the [P-Stream Extension](https://docs.pstream.mov/extension).

The following services are included and configured:

- [Frontend](./frontend), dependant on [Providers](./providers)
- [Backend](./backend) + Postgres Database
- [AIO Proxy](https://github.com/groknt/AIO-Proxy)
- Traefik Reverse Proxy

To run P-Stream, ensure [Docker](https://docs.docker.com/engine/install) and Docker Compose are installed and run the following command:

```sh
docker compose up --wait -d
```

To stop it, run:

```sh
docker compose down
```

If it's succeeded, P-Stream should be accessible at http://localhost:4000.

You can configure further by modifying the [.env](.env) and/or [compose.yaml](compose.yaml) files.

## Troubleshooting

> ### chmod: changing permissions of '/var/lib/postgresql/data': Operation not permitted

Ensure the `./data/backend/database` directory is owned by your user.

If using WSL, run docker compose up outside of WSL once.
