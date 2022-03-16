ServerX
=================

Centrally manage AWS, GCP and on-premise servers and connect to them via SSH. Update security group, access control list, firewall and security policy rules with your new IP. 

[![Docs](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://serverx.haribodev.uk)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/serverx)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/serverx)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/HariboDev/serverx/blob/main/package.json)

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
* [`serverx connect`](#serverx-connect)
* [`serverx help [COMMAND]`](#serverx-help-command)
* [`serverx list`](#serverx-list)
* [`serverx servers ACTION`](#serverx-servers-action)
* [`serverx servers add`](#serverx-servers-add)
* [`serverx servers modify`](#serverx-servers-modify)
* [`serverx servers remove`](#serverx-servers-remove)
* [`serverx update`](#serverx-update)

## `serverx accounts ACTION`

Manage registered AWS & GCP accounts

```
USAGE
  $ serverx accounts [ACTION] [-d]

ARGUMENTS
  ACTION  (list|register|deregister|modify) List, register, deregister or modify an account

FLAGS
  -d, --detail  Display extra account details

DESCRIPTION
  Manage registered AWS & GCP accounts

  List, register, deregister or modify registered AWS & GCP accounts

EXAMPLES
  $ serverx accounts

  $ serverx accounts list

  $ serverx accounts register

  $ serverx accounts deregister

  $ serverx accounts modify
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

  Deregister an AWS or GCP account

EXAMPLES
  $ serverx accounts deregister
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

Modify an account

```
USAGE
  $ serverx accounts modify [-d]

FLAGS
  -d, --detail  Display extra account details

DESCRIPTION
  Modify an account

  Modify a registered AWS or GCP account

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

  Register an AWS or GCP account

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

## `serverx connect`

Connect using SSH to an EC2 instance

```
USAGE
  $ serverx connect [-i <value>] [-n <value>] [-a <value>] [-u <value>] [-d <value>] [-k <value>] [-p]

FLAGS
  -a, --address=<value>    Instance Address
  -d, --directory=<value>  Override pem file directory
  -i, --index=<value>      Instance index
  -k, --key=<value>        Override pem file name
  -n, --name=<value>       Instance name
  -p, --password           Ask for password
  -u, --username=<value>   Override connection username

DESCRIPTION
  Connect using SSH to an EC2 instance

  Connect to an EC2 instance using either the instance index, name or address.

  Ability to override username and/or pem directory
```

_See code: [dist/commands/connect/index.ts](https://github.com/HariboDev/serverx/blob/v0.0.0/dist/commands/connect/index.ts)_

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

## `serverx list`

Display AWS, GCP and self-managed servers

```
USAGE
  $ serverx list [-l <value>] [-s pending|running|stopping|stopped|shutting-down|terminated] [-a <value>]
    [-m aws|self] [--no-refresh]

FLAGS
  -a, --account=<value>...   [default: all] Only get servers from a specific account(s)
  -l, --location=<value>...  [default: all] Only get servers in a specific location(s)
  -m, --managed=<option>...  [default: all] Only get servers under a specific management(s)
                             <options: aws|self>
  -s, --state=<option>...    [default: all] Only get servers of in a specific state(s)
                             <options: pending|running|stopping|stopped|shutting-down|terminated>
  --no-refresh               Don't refresh the cache of known servers

DESCRIPTION
  Display AWS, GCP and self-managed servers

  Gathers up AWS, GCP and self-managed servers and displays summaries in a table
```

_See code: [dist/commands/list/index.ts](https://github.com/HariboDev/serverx/blob/v0.0.0/dist/commands/list/index.ts)_

## `serverx servers ACTION`

Manage self-managed servers

```
USAGE
  $ serverx servers [ACTION]

ARGUMENTS
  ACTION  (add|remove|modify) Add, remove or modify an account

DESCRIPTION
  Manage self-managed servers

  Add, remove or modify self-managed servers

EXAMPLES
  $ serverx servers

  $ serverx servers add

  $ serverx servers remove

  $ serverx servers modify
```

_See code: [dist/commands/servers/index.ts](https://github.com/HariboDev/serverx/blob/v0.0.0/dist/commands/servers/index.ts)_

## `serverx servers add`

Add a self-managed server

```
USAGE
  $ serverx servers add

DESCRIPTION
  Add a self-managed server

  Add a self-managed server

EXAMPLES
  $ serverx servers add
```

## `serverx servers modify`

Modify an self-managed server

```
USAGE
  $ serverx servers modify

DESCRIPTION
  Modify an self-managed server

  Modify a self-managed server

EXAMPLES
  $ serverx servers modify
```

## `serverx servers remove`

Remove a self-managed server

```
USAGE
  $ serverx servers remove

DESCRIPTION
  Remove a self-managed server

  Remove a self-managed server

EXAMPLES
  $ serverx servers remove
```

## `serverx update`

Update security groups with your new public IP

```
USAGE
  $ serverx update [-r
    us-east-1|us-east-2|us-west-1|us-west-2|ap-south-1|ap-northeast-1|ap-northeast-2|ap-southeast-1|ap-southeast-2|ca-ce
    ntral-1|eu-central-1|eu-west-1|eu-west-2|eu-west-3|eu-north-1|sa-east-1]

FLAGS
  -r, --region=<option>...  [default: all] Only update security groups in a specific region(s)
                            <options: us-east-1|us-east-2|us-west-1|us-west-2|ap-south-1|ap-northeast-1|ap-northeast-2|a
                            p-southeast-1|ap-southeast-2|ca-central-1|eu-central-1|eu-west-1|eu-west-2|eu-west-3|eu-nort
                            h-1|sa-east-1>

DESCRIPTION
  Update security groups with your new public IP

  Checks if your public IP has changed and updates relevant AWS security groups

EXAMPLES
  $ serverx update

  $ serverx update --region eu-west-1

  $ serverx update --region eu-west-1 eu-west-1
```

_See code: [dist/commands/update/index.ts](https://github.com/HariboDev/serverx/blob/v0.0.0/dist/commands/update/index.ts)_
<!-- commandsstop -->
