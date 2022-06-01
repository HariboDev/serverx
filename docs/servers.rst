**********
🖧 Servers
**********

Description
===========

This command allows you to list, add, remove and modify servers
from the CLI.

The servers command follows the following format:

.. code-block:: console

  $ serverx servers [ACTION]

Where ``ACTION`` is one of the following:

* ``list`` - List AWS, GCP or self-managed servers
* ``add`` - Add a self-managed server
* ``remove`` - Remove a self-managed server
* ``modify`` - Modify a self-managed server

List
====

List AWS, GCP or self-managed servers

Usage
*****

.. code-block:: console

  $ serverx servers list [TYPE] [OPTIONS]

Where ``TYPE`` is one of the following:

* ``aws`` - List AWS servers
* ``gcp`` - List GCP servers
* ``self`` - List self-managed servers

Options
*******

* ``--account | -a``

  * Type: ``string[]``
  * Description: Only get servers from a specific account(s)
  * Default: ``all``

* ``--region | -r``

  * Type: ``string[]``
  * Description: Only list servers in a specific region(s)
  * Default: ``all``
  * AWS Options:
    * ``us-east-1``
    * ``us-east-2``
    * ``us-west-1``
    * ``us-west-2``
    * ``ap-south-1``
    * ``ap-northeast-1``
    * ``ap-northeast-2``
    * ``ap-southeast-1``
    * ``ap-southeast-2``
    * ``ca-central-1``
    * ``eu-central-1``
    * ``eu-west-1``
    * ``eu-west-2``
    * ``eu-west-3``
    * ``eu-north-1``
    * ``sa-east-1``
  * GCP Options:
    * ``asia-east1``
    * ``asia-east2``
    * ``asia-northeast1``
    * ``asia-northeast2``
    * ``asia-northeast3``
    * ``asia-south1``
    * ``asia-south2``
    * ``asia-southeast1``
    * ``asia-southeast2``
    * ``australia-southeast1``
    * ``europe-central2``
    * ``europe-north1``
    * ``europe-west1``
    * ``europe-west2``
    * ``europe-west3``
    * ``europe-west4``
    * ``europe-west6``
    * ``northamerica-northeast1``
    * ``northamerica-northeast2``
    * ``southamerica-east1``
    * ``southamerica-west1``
    * ``us-central1``
    * ``us-east1``
    * ``us-east4``
    * ``us-west1``
    * ``us-west2``
    * ``us-west3``
    * ``us-west4``

* ``--state | -s``

  * Type: ``string[]``
  * Description: Only list servers in a specific state(s)
  * Default: ``all``
  * Options:
    * ``pending``
    * ``running``
    * ``stopping``
    * ``stopped``
    * ``shutting-down``
    * ``terminated``

.. note::
  When gathering AWS servers, the ServerX will then check if the
  servers are accessible on port ``22`` automatically. This will then be displayed in the summary table.

Examples
********

.. code-block:: console
  :caption: The example below shows that executing the ``list aws --account Personal`` command displays all AWS servers in the Personal account.

  $ serverx servers list --account Personal
  [INFO] Located config file
  [INFO] Located instances file
  [INFO] Gathering AWS managed instances
  [INFO] Checking account: Personal
  [INFO] Checking region: eu-north-1
  [INFO] Checking region: ap-south-1
  [INFO] Checking region: eu-west-3
  [INFO] Checking region: eu-west-2
  [INFO] Checking region: eu-west-1
  [INFO] Checking region: ap-northeast-3
  [INFO] Checking region: ap-northeast-2
  [INFO] Checking region: ap-northeast-1
  [INFO] Checking region: sa-east-1
  [INFO] Checking region: ca-central-1
  [INFO] Checking region: ap-southeast-1
  [INFO] Checking region: ap-southeast-2
  [INFO] Checking region: eu-central-1
  [INFO] Checking region: us-east-1
  [INFO] Checking region: us-east-2
  [INFO] Checking region: us-west-1
  [INFO] Checking region: us-west-2
  [INFO] Successfully saved to instances file
  ┌───────┬─────────────────┬─────────────────┬──────────────────┬───────────────┬─────────┬────────────┬───────────┬──────────┬────────────┐
  │ Index │ Name            │ Address         │ Key Pair         │ Username      │ State   │ Accessible │ Location  │ Account  │ Managed By │
  ├───────┼─────────────────┼─────────────────┼──────────────────┼───────────────┼─────────┼────────────┼───────────┼──────────┼────────────┤
  │ 0     │ example_server  │ 123.456.789.123 │ example_key.pem  │ example_user  │ running │ true       │ eu-west-1 │ Personal │ AWS        │
  ├───────┼─────────────────┼─────────────────┼──────────────────┼───────────────┼─────────┼────────────┼───────────┤──────────┼────────────┤
  │ 1     │ example_server2 │ 987.654.321.987 │ example_key2.pem │ example_user2 │ stopped │ false      │ eu-west-1 │ Personal │ AWS        │
  ├───────┼─────────────────┼─────────────────┼──────────────────┼───────────────┼─────────┼────────────┼───────────┤──────────┼────────────┤
  │ 2     │ example_server3 │ 456.789.123.456 │ example_key3.pem │ example_user3 │ unknown │ true       │ N/A       │ N/A      │ Self       │
  └───────┴─────────────────┴─────────────────┴──────────────────┴───────────────┴─────────┴────────────┴───────────┴──────────┴────────────┘

.. code-block:: console
  :caption: This example shows that executing the ``list gcp --account Work --region europe-west2`` command displays all the GCP servers in the Work account in the europe-west2 region.

  $ serverx servers list gcp --account Work --region europe-west2
  [INFO] Located config file
  [INFO] Located instances file
  [INFO] Gathering GCP managed instances
  [INFO] Checking account: gcpTest
  [INFO] Checking region: europe-west2
  [INFO] Successfully saved to instances file
  ┌───────┬────────────────┬─────────────────┬─────────┬────────────┬──────────────┬────────────────┬────────────┐
  │ Index │ Name           │ Address         │ State   │ Accessible │ Location     │ Account        │ Managed By │
  ├───────┼────────────────┼─────────────────┼─────────┼────────────┼──────────────┼────────────────┼────────────┤
  │ 1     │ example_server │ 123.456.789.123 │ RUNNING │ true       │ europe-west2 │ gcp-project-id │ GCP        │
  └───────┴────────────────┴─────────────────┴─────────┴────────────┴──────────────┴────────────────┴────────────┘

.. code-block:: console
  :caption: The example below shows that executing the ``list self`` command displays all the self-managed servers.

  $ serverx servers list self
  [INFO] Located config file
  [INFO] Located instances file
  [INFO] Gathering self managed instances
  ┌───────┬────────────────┬─────────────────┬─────────────────┬──────────────┬────────────┬──────────┬────────────┐
  │ Index │ Name           │ Address         │ Key Pair        │ Username     │ Accessible │ Location │ Managed By │
  ├───────┼────────────────┼─────────────────┼─────────────────┼──────────────┼────────────┼──────────┼────────────┤
  │ 1     │ example_server │ 123.456.789.123 │ example_key.pem │ example_user │ true       │ N/A      │ Self       │
  └───────┴────────────────┴─────────────────┴─────────────────┴──────────────┴────────────┴──────────┴────────────┘

Add
===

Add a self-managed server

Usage
*****

.. code-block:: console

  $ serverx servers add

Examples
********

.. code-block:: console
  :caption: The example below shows that executing the ``add`` command initiates the process of adding a self-managed server to the CLI.

  $ serverx servers add
  [INFO] Located instances file
  ? Server Name TestServer
  ? Server Address 123.456.789.123
  ? Server Location Office
  ? Username myUser
  ? Do you want to use a key pair? No
  [INFO] Successfully saved to instances file

.. note::
  The updated self-managed servers list can be viewed by executing the ``list self`` command.

.. note::
  If a key pair is not provided, a password prompt will be displayed when trying to connect to the server using the ``servers list self`` command.

Remove
======

Remove a self-managed server

Usage
*****

.. code-block:: console

  $ serverx servers remove

Examples
********

.. code-block:: console
  :caption: The example below shows that executing the ``remove`` command initiates the process of removing a self-managed server from the CLI.

  $ serverx servers remove
  [INFO] Located instances file
  ? Server address to remove 123.456.789.123
  [INFO] Successfully saved to instances file

.. note::
  The updated self-managed servers list can be viewed by executing the ``list self`` command.

Modify
======

Modify a self-managed server

Usage
*****

.. code-block:: console

  $ serverx servers modify

Examples
********

.. code-block:: console
  :caption: The example below shows that executing the ``modify`` command initiates the process of modifying a self-managed server in the CLI.

  $ serverx servers modify
  [INFO] Located instances file
  ? Server address to modify 123.456.789.123
  ? Server Name TestServer
  ? Server Address 123.456.789.123
  ? Server Location 
  ? Username myUser
  ? Do you want to use a key pair? No
  [INFO] Successfully saved to instances file

.. note::
  The updated self-managed servers list can be viewed by executing the ``list self`` command.
