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
* [`serverx hello PERSON`](#serverx-hello-person)
* [`serverx hello world`](#serverx-hello-world)
* [`serverx help [COMMAND]`](#serverx-help-command)
* [`serverx plugins`](#serverx-plugins)
* [`serverx plugins:inspect PLUGIN...`](#serverx-pluginsinspect-plugin)
* [`serverx plugins:install PLUGIN...`](#serverx-pluginsinstall-plugin)
* [`serverx plugins:link PLUGIN`](#serverx-pluginslink-plugin)
* [`serverx plugins:uninstall PLUGIN...`](#serverx-pluginsuninstall-plugin)
* [`serverx plugins update`](#serverx-plugins-update)

## `serverx hello PERSON`

Say hello

```
USAGE
  $ serverx hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/HariboDev/serverx/blob/v0.0.0/dist/commands/hello/index.ts)_

## `serverx hello world`

Say hello world

```
USAGE
  $ serverx hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

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

## `serverx plugins`

List installed plugins.

```
USAGE
  $ serverx plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ serverx plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `serverx plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ serverx plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ serverx plugins:inspect myplugin
```

## `serverx plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ serverx plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ serverx plugins add

EXAMPLES
  $ serverx plugins:install myplugin 

  $ serverx plugins:install https://github.com/someuser/someplugin

  $ serverx plugins:install someuser/someplugin
```

## `serverx plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ serverx plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ serverx plugins:link myplugin
```

## `serverx plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ serverx plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ serverx plugins unlink
  $ serverx plugins remove
```

## `serverx plugins update`

Update installed plugins.

```
USAGE
  $ serverx plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
