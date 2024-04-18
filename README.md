# BS3206

# Getting started

## Install pre-requisites
1. [Install docker](https://docs.docker.com/engine/install/). If installing the CLI version, ensure docker compose is also installed. In the terminal, run `docker compose version` to ensure all is ok before proceeding.
1. Install the `make` package via the package manager for your OS. If using mac, this will be [Homebrew](https://brew.sh) or [Chocolatey](https://chocolatey.org) for windows, if these are not already installed then you will need to do this first. In a terminal, run `make --version` to ensure it's installed successfully.

## Developing on the stack
The front end uses [NextJS](https://nextjs.org) (a [ReactJS](https://react.dev) derivative), ideally all UI components should be taken from google's [MUI](https://mui.com/material-ui/) package. Note that we are using the newer 'app' routing method for managing multiple pages. The backend uses [Express](https://expressjs.com) to host an API. The database is currently TBC.

There are two environments, both hosted locally: dev (development), and prd (production). The development environment is where most of your work will be centred as it supports hot reloading (HMR) so that the front and back ends are updated live, as you change and save the code, without having to re-build or re-start them. The production environment statically compiles the application. To get started, [deploy the dev stack](#deploy-stack) and [access it](#accessing-the-stack).

## Deploy stack
Most interactions with the application stack will be done using `make` which is a tool for writing small scripts called 'targets', these are defined in `./Makefile` found in the project root directory. All make commands should be executed from the project root.

- Deploy development stack<br/>
    ```bash
    make dev-env-up
    ```
- Stop development stack - press `ctrl+c` in the active terminal session for the application
- Destroy development stack<br/>
    ```
    make dev-env-down
    ```

The same operations also apply to the production stack which uses `make prd-env-up` and `make prd-env-down` respectively.

## Accessing the stack
Use the below addresses to access the various components from the **host** machine:
- [frontend](http://localhost)
- [backend](http://localhost:8080) (dev only)
- database: `server=localhost;uid=root;pwd=pass` (dev only)
