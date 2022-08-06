@haribodev/serverx
=================

Centrally manage AWS, GCP and self-managed servers and connect to them via SSH. Update security group, firewall and security policy rules with your new IP. 

[![Version](https://img.shields.io/npm/v/@haribodev/serverx.svg)](https://npmjs.org/package/@haribodev/serverx)
[![Downloads/week](https://img.shields.io/npm/dw/@haribodev/serverx.svg)](https://npmjs.org/package/@haribodev/serverx)
[![License](https://img.shields.io/npm/l/@haribodev/serverx.svg)](https://github.com/HariboDev/serverx/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @haribodev/serverx
$ serverx COMMAND
running command...
$ serverx (--version)
@haribodev/serverx/1.1.0 linux-x64 node-v16.13.2
$ serverx --help [COMMAND]
USAGE
  $ serverx COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`serverx accounts ACTION`](#serverx-accounts-action)
* [`serverx accounts deregister TYPE`](#serverx-accounts-deregister-type)
* [`serverx accounts deregister aws`](#serverx-accounts-deregister-aws)
* [`serverx accounts deregister gcp`](#serverx-accounts-deregister-gcp)
* [`serverx accounts list TYPE`](#serverx-accounts-list-type)
* [`serverx accounts list aws`](#serverx-accounts-list-aws)
* [`serverx accounts list gcp`](#serverx-accounts-list-gcp)
* [`serverx accounts modify TYPE`](#serverx-accounts-modify-type)
* [`serverx accounts modify aws`](#serverx-accounts-modify-aws)
* [`serverx accounts modify gcp`](#serverx-accounts-modify-gcp)
* [`serverx accounts register TYPE`](#serverx-accounts-register-type)
* [`serverx accounts register aws [ACTION]`](#serverx-accounts-register-aws-action)
* [`serverx accounts register aws import`](#serverx-accounts-register-aws-import)
* [`serverx accounts register gcp`](#serverx-accounts-register-gcp)
* [`serverx autocomplete [SHELL]`](#serverx-autocomplete-shell)
* [`serverx commands`](#serverx-commands)
* [`serverx configure`](#serverx-configure)
* [`serverx connect`](#serverx-connect)
* [`serverx help [COMMAND]`](#serverx-help-command)
* [`serverx servers ACTION`](#serverx-servers-action)
* [`serverx servers add`](#serverx-servers-add)
* [`serverx servers list TYPE`](#serverx-servers-list-type)
* [`serverx servers list aws`](#serverx-servers-list-aws)
* [`serverx servers list gcp`](#serverx-servers-list-gcp)
* [`serverx servers list self`](#serverx-servers-list-self)
* [`serverx servers modify`](#serverx-servers-modify)
* [`serverx servers remove`](#serverx-servers-remove)
* [`serverx update TYPE`](#serverx-update-type)
* [`serverx update aws`](#serverx-update-aws)
* [`serverx update gcp`](#serverx-update-gcp)

## `serverx accounts ACTION`

Manage registered AWS & GCP accounts

```
USAGE
  $ serverx accounts [ACTION]

ARGUMENTS
  ACTION  (list|register|deregister|modify) List, register, deregister or modify an account

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

_See code: [dist/commands/accounts/index.js](https://github.com/HariboDev/serverx/blob/v1.1.0/dist/commands/accounts/index.js)_

## `serverx accounts deregister TYPE`

Deregister an account

```
USAGE
  $ serverx accounts deregister [TYPE]

ARGUMENTS
  TYPE  (aws|gcp) List registered AWS or GCP accounts

DESCRIPTION
  Deregister an account

  Deregister an AWS or GCP account

EXAMPLES
  $ serverx accounts deregister

  $ serverx accounts deregister aws

  $ serverx accounts deregister gcp
```

## `serverx accounts deregister aws`

Deregister an AWS account

```
USAGE
  $ serverx accounts deregister aws [-d]

FLAGS
  -d, --detail  Display extra account details

DESCRIPTION
  Deregister an AWS account

  Deregister an AWS account

EXAMPLES
  $ serverx accounts deregister aws

  $ serverx accounts deregister aws --detail
```

## `serverx accounts deregister gcp`

Deregister a GCP account

```
USAGE
  $ serverx accounts deregister gcp

DESCRIPTION
  Deregister a GCP account

  Deregister a GCP account

EXAMPLES
  $ serverx accounts deregister gcp
```

## `serverx accounts list TYPE`

List registered accounts

```
USAGE
  $ serverx accounts list [TYPE]

ARGUMENTS
  TYPE  (aws|gcp) List registered AWS or GCP accounts

DESCRIPTION
  List registered accounts

  List registered AWS & GCP accounts

EXAMPLES
  $ serverx accounts list

  $ serverx accounts list aws

  $ serverx accounts list gcp
```

## `serverx accounts list aws`

List registered AWS accounts

```
USAGE
  $ serverx accounts list aws [-d]

FLAGS
  -d, --detail  Display extra account details

DESCRIPTION
  List registered AWS accounts

  List registered AWS accounts

EXAMPLES
  $ serverx accounts list aws

  $ serverx accounts list aws --detail
```

## `serverx accounts list gcp`

List registered AWS accounts

```
USAGE
  $ serverx accounts list gcp

DESCRIPTION
  List registered AWS accounts

  List registered AWS accounts

EXAMPLES
  $ serverx accounts list gcp
```

## `serverx accounts modify TYPE`

Modify a registered account

```
USAGE
  $ serverx accounts modify [TYPE]

ARGUMENTS
  TYPE  (aws|gcp) Modify a registered AWS or GCP account

DESCRIPTION
  Modify a registered account

  Modify a registered AWS or GCP account

EXAMPLES
  $ serverx accounts modify

  $ serverx accounts modify aws

  $ serverx accounts modify gcp
```

## `serverx accounts modify aws`

Modify an AWS account

```
USAGE
  $ serverx accounts modify aws [-d]

FLAGS
  -d, --detail  Display extra account details

DESCRIPTION
  Modify an AWS account

  Modify a registered AWS account

EXAMPLES
  $ serverx accounts modify aws

  $ serverx accounts modify aws --detail
```

## `serverx accounts modify gcp`

Modify a GCP account

```
USAGE
  $ serverx accounts modify gcp

DESCRIPTION
  Modify a GCP account

  Modify a registered GCP account

EXAMPLES
  $ serverx accounts modify gcp

  $ serverx accounts modify gcp --detail
```

## `serverx accounts register TYPE`

Register an account

```
USAGE
  $ serverx accounts register [TYPE]

ARGUMENTS
  TYPE  (aws|gcp) List registered AWS or GCP accounts

DESCRIPTION
  Register an account

  Register an AWS or GCP account

EXAMPLES
  $ serverx accounts register

  $ serverx accounts register aws

  $ serverx accounts register gcp
```

## `serverx accounts register aws [ACTION]`

Register an AWS account

```
USAGE
  $ serverx accounts register aws [ACTION] [-d]

ARGUMENTS
  ACTION  (import) Register AWS accounts

FLAGS
  -d, --detail  Display extra account details

DESCRIPTION
  Register an AWS account

EXAMPLES
  $ serverx accounts register aws

  $ serverx accounts register aws --detail

  $ serverx accounts register aws import
```

## `serverx accounts register aws import`

Register an AWS account by importing

```
USAGE
  $ serverx accounts register aws import [-d]

FLAGS
  -d, --detail  Display extra account details

DESCRIPTION
  Register an AWS account by importing

  Register an AWS account by importing an existing credentials file

EXAMPLES
  $ serverx accounts register aws

  $ serverx accounts register aws --detail

  $ serverx accounts register aws import
```

## `serverx accounts register gcp`

Register a GCP account

```
USAGE
  $ serverx accounts register gcp

DESCRIPTION
  Register a GCP account

EXAMPLES
  $ serverx accounts register gcp
```

## `serverx autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ serverx autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ serverx autocomplete

  $ serverx autocomplete bash

  $ serverx autocomplete zsh

  $ serverx autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v1.3.0/src/commands/autocomplete/index.ts)_

## `serverx commands`

list all the commands

```
USAGE
  $ serverx commands [--json] [-h] [--hidden] [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --hidden           show hidden commands
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  list all the commands
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v2.1.0/src/commands/commands.ts)_

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

_See code: [dist/commands/configure/index.js](https://github.com/HariboDev/serverx/blob/v1.1.0/dist/commands/configure/index.js)_

## `serverx connect`

Connect to an AWS server with SSH

```
USAGE
  $ serverx connect [-n <value>] [-a <value>] [-u <value>] [-d <value>] [-k <value>] [--port <value>] [-p]

FLAGS
  -a, --address=<value>    Instance Address
  -d, --directory=<value>  Override key file directory
  -k, --key=<value>        Override key file name
  -n, --name=<value>       Instance Name
  -p, --password           Ask for password
  -u, --username=<value>   Override connection username
  --port=<value>           [default: 22] Override port

DESCRIPTION
  Connect to an AWS server with SSH

  Connect to an AWS server with SSH using either the instance name or address.

  Ability to override username, key directory, key file and port.
```

_See code: [dist/commands/connect/index.js](https://github.com/HariboDev/serverx/blob/v1.1.0/dist/commands/connect/index.js)_

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

## `serverx servers ACTION`

List servers

```
USAGE
  $ serverx servers [ACTION]

ARGUMENTS
  ACTION  (list|add|remove|modify) Add, remove or modify an account

DESCRIPTION
  List servers

  List, add, remove or modify servers

EXAMPLES
  $ serverx servers

  $ serverx servers list

  $ serverx servers add

  $ serverx servers remove

  $ serverx servers modify
```

_See code: [dist/commands/servers/index.js](https://github.com/HariboDev/serverx/blob/v1.1.0/dist/commands/servers/index.js)_

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

## `serverx servers list TYPE`

List servers

```
USAGE
  $ serverx servers list [TYPE]

ARGUMENTS
  TYPE  (aws|gcp|self) List AWS, GCP or self-managed servers

DESCRIPTION
  List servers

  List AWS, GCP or self-managed servers

EXAMPLES
  $ serverx servers list

  $ serverx servers list aws

  $ serverx servers list gcp

  $ serverx servers list self
```

## `serverx servers list aws`

Display AWS servers

```
USAGE
  $ serverx servers list aws [-r
    us-east-1|us-east-2|us-west-1|us-west-2|ap-south-1|ap-northeast-1|ap-northeast-2|ap-southeast-1|ap-southeast-2|ca-ce
    ntral-1|eu-central-1|eu-west-1|eu-west-2|eu-west-3|eu-north-1|sa-east-1] [-s
    pending|running|stopping|stopped|shutting-down|terminated] [-a <value>] [--use-cache]

FLAGS
  -a, --account=<value>...  [default: all] Only get servers from a specific account(s)
  -r, --region=<option>...  [default: all] Only get servers in a specific region(s)
                            <options: us-east-1|us-east-2|us-west-1|us-west-2|ap-south-1|ap-northeast-1|ap-northeast-2|a
                            p-southeast-1|ap-southeast-2|ca-central-1|eu-central-1|eu-west-1|eu-west-2|eu-west-3|eu-nort
                            h-1|sa-east-1>
  -s, --state=<option>...   [default: all] Only get servers of in a specific state(s)
                            <options: pending|running|stopping|stopped|shutting-down|terminated>
  --use-cache               Use the local instances cache file

DESCRIPTION
  Display AWS servers

  Gathers up AWS servers and displays summaries in a table
```

## `serverx servers list gcp`

Display GCP servers

```
USAGE
  $ serverx servers list gcp [-r
    asia-east1|asia-east2|asia-northeast1|asia-northeast2|asia-northeast3|asia-south1|asia-south2|asia-southeast1|asia-s
    outheast2|australia-southeast1|europe-central2|europe-north1|europe-west1|europe-west2|europe-west3|europe-west4|eur
    ope-west6|northamerica-northeast1|northamerica-northeast2|southamerica-east1|southamerica-west1|us-central1|us-east1
    |us-east4|us-west1|us-west2|us-west3|us-west4] [-s pending|running|stopping|stopped|shutting-down|terminated] [-a
    <value>] [--use-cache]

FLAGS
  -a, --account=<value>...
      [default: all] Only get servers from a specific account(s)

  -r, --region=<option>...
      [default: all] Only get servers in a specific regions(s)
      <options: asia-east1|asia-east2|asia-northeast1|asia-northeast2|asia-northeast3|asia-south1|asia-south2|asia-southea
      st1|asia-southeast2|australia-southeast1|europe-central2|europe-north1|europe-west1|europe-west2|europe-west3|europe
      -west4|europe-west6|northamerica-northeast1|northamerica-northeast2|southamerica-east1|southamerica-west1|us-central
      1|us-east1|us-east4|us-west1|us-west2|us-west3|us-west4>

  -s, --state=<option>...
      [default: all] Only get servers of in a specific state(s)
      <options: pending|running|stopping|stopped|shutting-down|terminated>

  --use-cache
      Use the local instances cache file

DESCRIPTION
  Display GCP servers

  Gathers up GCP servers and displays summaries in a table
```

## `serverx servers list self`

Display self-managed servers

```
USAGE
  $ serverx servers list self [-r <value>] [--use-cache]

FLAGS
  -r, --region=<value>...  [default: all] Only get servers in a specific region(s)
  --use-cache              Use the local instances cache file

DESCRIPTION
  Display self-managed servers

  Gathers up self-managed servers and displays summaries in a table
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

## `serverx update TYPE`

Update security group and firewall rules

```
USAGE
  $ serverx update [TYPE]

ARGUMENTS
  TYPE  (aws|gcp) Update AWS or GCP rules

DESCRIPTION
  Update security group and firewall rules

  Update security group and firewall rules within AWS and GCP

EXAMPLES
  $ serverx update

  $ serverx update aws

  $ serverx update gcp
```

_See code: [dist/commands/update/index.js](https://github.com/HariboDev/serverx/blob/v1.1.0/dist/commands/update/index.js)_

## `serverx update aws`

Update security groups with your new public IP

```
USAGE
  $ serverx update aws [-r
    us-east-1|us-east-2|us-west-1|us-west-2|ap-south-1|ap-northeast-1|ap-northeast-2|ap-southeast-1|ap-southeast-2|ca-ce
    ntral-1|eu-central-1|eu-west-1|eu-west-2|eu-west-3|eu-north-1|sa-east-1] [-a <value>] [-f <value>] [-t <value>] [-s]

FLAGS
  -a, --account=<value>...  [default: all] Only update security groups in a specific account(s)
  -f, --from=<value>        Only update security groups with this as its existing source IP address. Overrides the users
                            actual old IP
  -r, --region=<option>...  [default: all] Only update security groups in a specific region(s)
                            <options: us-east-1|us-east-2|us-west-1|us-west-2|ap-south-1|ap-northeast-1|ap-northeast-2|a
                            p-southeast-1|ap-southeast-2|ca-central-1|eu-central-1|eu-west-1|eu-west-2|eu-west-3|eu-nort
                            h-1|sa-east-1>
  -s, --[no-]save           Save your new IP address to your config file. Not ideal for consecutive commands
  -t, --to=<value>          Only update security groups with this as its new source IP address. Overrides users actual
                            current IP

DESCRIPTION
  Update security groups with your new public IP

  Checks if your public IP has changed and updates relevant AWS security groups

EXAMPLES
  $ serverx update

  $ serverx update aws

  $ serverx update aws --region eu-west-1
```

## `serverx update gcp`

Update firewall rules and cloud armor with your new public IP

```
USAGE
  $ serverx update gcp [-r
    asia-east1|asia-east2|asia-northeast1|asia-northeast2|asia-northeast3|asia-south1|asia-south2|asia-southeast1|asia-s
    outheast2|australia-southeast1|europe-central2|europe-north1|europe-west1|europe-west2|europe-west3|europe-west4|eur
    ope-west6|northamerica-northeast1|northamerica-northeast2|southamerica-east1|southamerica-west1|us-central1|us-east1
    |us-east4|us-west1|us-west2|us-west3|us-west4] [-a <value>] [-f <value>] [-t <value>] [-s]

FLAGS
  -a, --account=<value>...
      [default: all] Only update firewall and cloud armor armor rules in a specific account(s)

  -f, --from=<value>
      Only update firewall and cloud armor armor rules with this as its existing source IP address. Overrides the users
      actual old IP

  -r, --region=<option>...
      [default: all] Only update firewall and cloud armor armor rules in a specific region(s)
      <options: asia-east1|asia-east2|asia-northeast1|asia-northeast2|asia-northeast3|asia-south1|asia-south2|asia-southea
      st1|asia-southeast2|australia-southeast1|europe-central2|europe-north1|europe-west1|europe-west2|europe-west3|europe
      -west4|europe-west6|northamerica-northeast1|northamerica-northeast2|southamerica-east1|southamerica-west1|us-central
      1|us-east1|us-east4|us-west1|us-west2|us-west3|us-west4>

  -s, --[no-]save
      Save your new IP address to your config file. Not ideal for consecutive commands

  -t, --to=<value>
      Only update firewall and cloud armor armor rules with this as its new source IP address. Overrides users actual
      current IP

DESCRIPTION
  Update firewall rules and cloud armor with your new public IP

  Checks if your public IP has changed and updates relevant GCP firewall rules and cloud armor policies

EXAMPLES
  $ serverx update

  $ serverx update gcp
```
<!-- commandsstop -->
