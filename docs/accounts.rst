************
📄 Accounts
************

Description
===========

This command allows you to view, register, modify and deregister accounts
to the CLI. If adding an AWS account, internal and cross account roles
can also be assumed.

The accounts command follows the following format:

.. code-block:: console

  $ serverx accounts [ACTION]

Where ``ACTION`` is one of the following:

* ``list`` - List AWS or GCP accounts registered to the CLI.
* ``register`` - Register an AWS or GCP account to the CLI.
* ``deregister`` - Deregister an AWS or GCP account from the CLI.
* ``modify`` - Modify an AWS or GCP account registered to the CLI.

List
====

List registered AWS or GCP accounts.

Usage
*****

.. code-block:: console

  $ serverx accounts list [TYPE] [OPTIONS]

Where ``TYPE`` is one of the following:

* ``aws`` - List all AWS accounts registered to the CLI.
* ``gcp`` - List all GCP accounts registered to the CLI.

Options
*******

* ``--detail | -d``
  
  If listing AWS accounts, the AWS Secret Access Key will not be masked and instead
  will be shown as plaintext.

Examples
********

.. code-block:: console
  :caption: The example below shows that executing the ``list aws`` command without any arguments displays all the AWS accounts registered with the CLI to the console.

  $ serverx accounts list aws
  [INFO] Located config file
  ┌──────────────┬──────────────────────┬──────────────────────────────────────────┬─────────────────────────────────────────────┐
  │ Account Name │ Access Key           │ Secret Access Key                        │ Role ARN                                    │
  ├──────────────┼──────────────────────┼──────────────────────────────────────────┼─────────────────────────────────────────────┤
  │ Personal     │ AKIAIOSFODNN7EXAMPLE │ ************************************EKEY │ arn:aws:iam::123456789012:role/Example_Role │
  └──────────────┴──────────────────────┴──────────────────────────────────────────┴─────────────────────────────────────────────┘

.. code-block:: console
  :caption: This example shows that executing the ``list gcp`` command displays all the GCP accounts registered with the CLI to the console.

  $ serverx accounts list aws
  [INFO] Located config file
  ┌──────────────┬────────────────┬──────────────────────────────────┐
  │ Account Name │ Project ID     │ Credentials File Location        │
  ├──────────────┼────────────────┼──────────────────────────────────┤
  │ gcpExample   │ gcp-project-id │ /PATH/TO/google-credentials.json │
  └──────────────┴────────────────┴──────────────────────────────────┘

Register
========

Register an AWS or GCP account.

Usage
*****

.. code-block:: console

  $ serverx accounts register [TYPE] [OPTIONS]

Where ``TYPE`` is one of the following:

* ``aws`` - Register an AWS account to the CLI.
* ``gcp`` - Register a GCP account to the CLI.

Options
*******

* ``import``

  When registering an AWS account, the ``import`` option can be used to import
  credentials from an AWS provided ``.csv`` file.
* ``--detail | -d``
  
  If registering an AWS account, the AWS Secret Access Key will not be masked and instead
  will be shown as plaintext when the account summaries are displayed.

Examples
********

.. code-block:: console
  :caption: The example below shows that executing the ``register aws`` command starts the registration process for an AWS account to the CLI.

  $ serverx accounts register aws
  [INFO] Located config file
  ? AWS Account Name Personal
  ? AWS Access Key AKIAIOSFODNN7EXAMPLE
  ? AWS Secret Access Key wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
  ? Do you need to assume a role? Yes
  ? Role ARN arn:aws:iam::123456789012:role/Example_Role
  [INFO] Successfully saved to config file
  ┌──────────────┬──────────────────────┬──────────────────────────────────────────┬─────────────────────────────────────────────┐
  │ Account Name │ Access Key           │ Secret Access Key                        │ Role ARN                                    │
  ├──────────────┼──────────────────────┼──────────────────────────────────────────┼─────────────────────────────────────────────┤
  │ Personal     │ AKIAIOSFODNN7EXAMPLE │ ************************************EKEY │ arn:aws:iam::123456789012:role/Example_Role │
  └──────────────┴──────────────────────┴──────────────────────────────────────────┴─────────────────────────────────────────────┘

.. code-block:: console
  :caption: This example shows that executing the ``register aws import`` command starts the registration process for a AWS account to the CLI by importing an existing ``.csv`` credentials file.

  $ serverx accounts register aws import
  [INFO] Located config file
  ? AWS Credentials File /PATH/TO/user_accessKeys.csv
  ? AWS Account Name Work
  ? Do you need to assume a role? No
  [INFO] Successfully saved to config file
  [INFO] Located config file
  ┌──────────────┬──────────────────────┬──────────────────────────────────────────┬─────────────────────────────────────────────┐
  │ Account Name │ Access Key           │ Secret Access Key                        │ Role ARN                                    │
  ├──────────────┼──────────────────────┼──────────────────────────────────────────┼─────────────────────────────────────────────┤
  │ Personal     │ AKIAIOSFODNN7EXAMPLE │ ************************************EKEY │ arn:aws:iam::123456789012:role/Example_Role │
  ├──────────────┼──────────────────────┼──────────────────────────────────────────┼─────────────────────────────────────────────┤
  │ Work         │ AKIAIOSFODNN8EXAMPLE │ ************************************FKEY │ N/A                                         │
  └──────────────┴──────────────────────┴──────────────────────────────────────────┴─────────────────────────────────────────────┘

.. note::
  The ``import`` argument is only available for AWS accounts and the ``.csv`` file
  must be readable to the current user.

.. code-block:: console
  :caption: The example below shows that executing the ``register gcp`` command starts the registration process for a GCP account to the CLI.

  $ serverx accounts register gcp
  [INFO] Located config file
  ? Account Name gcpExample
  ? Project ID gcp-project-id
  ? Credentials File Location /PATH/TO/google-credentials.json
  [INFO] Successfully saved to config file
  [INFO] Located config file
  ┌──────────────┬────────────────┬──────────────────────────────────┐
  │ Account Name │ Project ID     │ Credentials File Location        │
  ├──────────────┼────────────────┼──────────────────────────────────┤
  │ gcpExample   │ gcp-project-id │ /PATH/TO/google-credentials.json │
  └──────────────┴────────────────┴──────────────────────────────────┘

.. note::
  The ``google-credentials.json`` file must be readable to the current user.

Deregister
==========

Deregister an AWS or GCP account.

Usage
*****

.. code-block:: console

  $ serverx accounts deregister [TYPE] [OPTIONS]

Where ``TYPE`` is one of the following:

* ``aws`` - Deregister an AWS account from the CLI.
* ``gcp`` - Deregister a GCP account from the CLI.

Options
*******

* ``--detail | -d``
  
  If deregistering an AWS account, the AWS Secret Access Key will not be masked
  and instead will be shown as plaintext when the account summaries are displayed.

Examples
********

.. code-block:: console
  :caption: The example below shows that executing the ``deregister aws`` command starts the deregistration process for an AWS account from the CLI.

  $ serverx accounts deregister aws
  [INFO] Located config file
  ? AWS account name to deregister Work
  [INFO] Successfully saved to config file
  [INFO] Located config file
  ┌──────────────┬──────────────────────┬──────────────────────────────────────────┬─────────────────────────────────────────────┐
  │ Account Name │ Access Key           │ Secret Access Key                        │ Role ARN                                    │
  ├──────────────┼──────────────────────┼──────────────────────────────────────────┼─────────────────────────────────────────────┤
  │ Personal     │ AKIAIOSFODNN7EXAMPLE │ ************************************EKEY │ arn:aws:iam::123456789012:role/Example_Role │
  └──────────────┴──────────────────────┴──────────────────────────────────────────┴─────────────────────────────────────────────┘

.. code-block:: console
  :caption: This example shows that executing the ``deregister gcp`` command starts the deregistration process for an GCP account from the CLI.

  $ serverx accounts deregister gcp
  [INFO] Located config file
  ? GCP account name to deregister gcpExample
  [INFO] Successfully saved to config file
  [INFO] Located config file
  ┌──────────────┬────────────┬───────────────────────────┐
  │ Account Name │ Project ID │ Credentials File Location │
  └──────────────┴────────────┴───────────────────────────┘

Modify
======

Modify a registered AWS or GCP account.

Usage
*****

.. code-block:: console

  $ serverx accounts modify [TYPE] [OPTIONS]

Where ``TYPE`` is one of the following:

* ``aws`` - Modify a registered AWS account from the CLI.
* ``gcp`` - Modify a registered GCP account from the CLI.

Options
*******

* ``--detail | -d``
  
  If modifying an AWS account, the AWS Secret Access Key will not be masked
  and instead will be shown as plaintext when the account summaries are displayed.

Examples
********

.. code-block:: console
  :caption: The example below shows that executing the ``modify aws`` command starts the modification process for an AWS account from the CLI.

  $ serverx accounts modify aws
  [INFO] Located config file
  ? AWS account name to modify Personal
  ? AWS Account Name Personal
  ? AWS Access Key AKIAIOSFODNN7EXAMPLE
  ? AWS Secret Access Key [hidden]
  ? Do you need to assume a role? No
  [INFO] Successfully saved to config file
  [INFO] Located config file
  ┌──────────────┬──────────────────────┬──────────────────────────────────────────┬──────────┐
  │ Account Name │ Access Key           │ Secret Access Key                        │ Role ARN │
  ├──────────────┼──────────────────────┼──────────────────────────────────────────┼──────────┤
  │ Personal     │ AKIAIOSFODNN7EXAMPLE │ ************************************EKEY │ N/A      │
  └──────────────┴──────────────────────┴──────────────────────────────────────────┴──────────┘

.. code-block:: console
  :caption: This example shows that executing the ``modify gcp`` command starts the modification process for an GCP account from the CLI.

  $ serverx accounts modify gcp
  [INFO] Located config file
  ? GCP account name to modify gcpExample
  ? Account Name gcpExample
  ? Project ID gcp-project-id
  ? Credentials File Location /NEW/PATH/TO/google-credentials.json
  [INFO] Successfully saved to config file
  [INFO] Located config file
  ┌──────────────┬────────────────┬──────────────────────────────────────┐
  │ Account Name │ Project ID     │ Credentials File Location            │
  ├──────────────┼────────────────┼──────────────────────────────────────┤
  │ gcpExample   │ gcp-project-id │ /NEW/PATH/TO/google-credentials.json │
  └──────────────┴────────────────┴──────────────────────────────────────┘