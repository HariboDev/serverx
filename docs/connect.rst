***********
🔌 Connect
***********

Description
===========

Connect to an AWS, GCP or self-managed server with SSH using either
the server name or address. Ability to override the username, key
directory, key file and port.

The connect command follows the following format:

.. code-block:: console

  $ serverx connect [OPTIONS]

Options
=======

* ``--address | -a``

  * Type: ``string``
  * Description: The address of the server you to connect to.
  * Example: ``123.456.789.123``

* ``--directory | -d``

  * Type: ``string``
  * Description: Override the directory which is searched for the private key file.
  * Example: ``~/my_ssh_keys``

* ``--key | -k``

  * Type: ``string``
  * Description: Override the private key file name that will be used to SSH.
  * Example: ``my_key_file.pem``

* ``--name | -n``

  * Type: ``string``
  * Description: The server name you want to connect to.
  * Example: ``my_server``

* ``--password | -p``

  * Type: ``boolean``
  * Description: Prompt for password instead of private key. Takes precedence over private key.

* ``--port``

  * Type: ``boolean``
  * Description: Override the port used in the SSH connection.
  * Default: ``22``

* ``--username | -u``

  * Type: ``string``
  * Description: Override the username used in the SSH connection.
  * Example: ``test_user``

Examples
========

.. code-block:: console
  :caption: The example below shows the CLI tool being used to connect to a server with the IP address: ``123.456.789.123``.

  $ serverx connect --address 123.456.789.123

  [INFO] Connecting to "SERVER_NAME" as "EXAMPLE_USER" at "123.456.789.123:22"
  [INFO] If these details are incorrect, execute "serverx servers list" to update server details and try again
  [INFO] Attempting to connect...

.. code-block:: console
  :caption: This example shows the CLI tool being used to connect to a server with the name: ``example_server``. It also overrides the username and password that will be used to connect to the instance.

  $ serverx connect --name example_server --username example_user --password
  Enter password for example_user@123.456.789.123:22: MyPassword

  [INFO] Connecting to "example_server" as "example_user" at "123.456.789.123:22"
  [INFO] If these details are incorrect, execute "serverx servers list" to update instance details and try again
  [INFO] Attempting to connect...

.. code-block:: console
  :caption: The example below shows the CLI tool being used to connect to a server with the address ``123.456.789.123``. It also overrides the username, private key and private key directory. By doing this, the CLI tool will attempt to find the new private key file in the specified directory and use it along with the new username to connect to the instance.

  $ serverx connect --address 123.456.789.123 -u example_user -d ~/ssh_keys -k my_key_file.pem

  [INFO] Connecting to "SERVER_NAME" as "example_user" at "123.456.789.123:22"
  [INFO] If these details are incorrect, execute "serverx servers list" to update instance details and try again
  [INFO] Attempting to connect...
