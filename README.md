oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g serverx
$ serverx COMMAND
running command...
$ serverx (--version)
serverx/0.0.0 linux-x64 node-v16.13.2
$ serverx --help [COMMAND]
USAGE
  $ serverx COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`serverx accounts ACTION`](#serverx-accounts-action)
* [`serverx accounts deregister`](#serverx-accounts-deregister)
* [`serverx accounts list`](#serverx-accounts-list)
* [`serverx accounts modify`](#serverx-accounts-modify)
* [`serverx accounts register`](#serverx-accounts-register)
* [`serverx configure`](#serverx-configure)
* [`serverx help [COMMAND]`](#serverx-help-command)

## `serverx accounts ACTION`

Display registered AWS & GCP accounts

```
USAGE
  $ serverx accounts [ACTION] [-d]

ARGUMENTS
  ACTION  (list|register|remove|edit) List, register, remove or edit an account

FLAGS
  -d, --detail  Display extra account details

DESCRIPTION
  Display registered AWS & GCP accounts

  Display registered AWS & GCP accounts

EXAMPLES
  $ serverx accounts

  $ serverx accounts list

  $ serverx accounts register

  $ serverx accounts remove

  $ serverx accounts edit
```

_See code: [dist/commands/accounts/index.ts](https://github.com/HariboDev/serverx/blob/v0.0.0/dist/commands/accounts/index.ts)_

## `serverx accounts deregister`

Deregister an account

```
USAGE
  $ serverx accounts deregister [-d]

FLAGS
  -d, --detail  Display extra account details

DESCRIPTION
  Deregister an account

  Deregister an AWS or GCP account with serverx

EXAMPLES
  $ serverx accounts deregeister
```

## `serverx accounts list`

List accounts

```
USAGE
  $ serverx accounts list [-d]

FLAGS
  -d, --detail  Display extra account details

DESCRIPTION
  List accounts

  List registered AWS & GCP accounts

EXAMPLES
  $ serverx accounts list
```

## `serverx accounts modify`

Register an account

```
USAGE
  $ serverx accounts modify [-d]

FLAGS
  -d, --detail  Display extra account details

DESCRIPTION
  Register an account

  Register an AWS or GCP account with serverx

EXAMPLES
  $ serverx accounts register
```

## `serverx accounts register`

Register an account

```
USAGE
  $ serverx accounts register [-d]

FLAGS
  -d, --detail  Display extra account details

DESCRIPTION
  Register an account

  Register an AWS or GCP account with serverx

EXAMPLES
  $ serverx accounts register
```

## `serverx configure`

Configure serverx

```
USAGE
  $ serverx configure

DESCRIPTION
  Configure serverx

  Add accounts and customise serverx

EXAMPLES
  $ serverx configure
```

_See code: [dist/commands/configure/index.ts](https://github.com/HariboDev/serverx/blob/v0.0.0/dist/commands/configure/index.ts)_

## `serverx help [COMMAND]`

Display help for serverx.

```
USAGE
  $ serverx help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for serverx.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_
<!-- commandsstop -->
