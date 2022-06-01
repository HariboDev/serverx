**********
✏️ Update
**********

Description
===========

This command checks if your public IP has changed and updates
the relevant security group, firewall and security policy rules rules that explicitly contained your old IP address.

The update command follows the following format:

.. code-block:: console

  $ serverx update [TYPE] [OPTIONS]

Where ``TYPE`` is one of the following:

* ``aws`` - Update AWS security group rules.
* ``gcp`` - Update GCP firewall and security policy rules.

Options
=======

* ``--region | -r``

  * Type: ``string[]``
  * Description: Only update security groups in a specific region(s)
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

* ``--account | -a``

  * Type: ``string[]``
  * Description: Only update security group, firewall and cloud armor armor rules in a specific account(s)
  * Default: ``all``

* ``--from | -f``

  * Type: ``string``
  * Description: Only update security group, firewall and cloud armor armor rules with this as its existing source IP address. Overrides the users actual old IP
  * Default: ``all``

* ``--to | -t``

  * Type: ``string``
  * Description: Only update security group, firewall and cloud armor armor rules with this as its new source IP address. Overrides users actual current IP
  * Default: ``all``

Examples
========

.. code-block:: console
  :caption: The example below shows that executing the ``update aws`` command will update all security group rules in all regions.

  $ serverx update aws
  [INFO] IP change detected
  [INFO] Old IP: 123.456.789
  [INFO] Current IP: 987.654.321
  [INFO] Checking account: Personal
  [INFO] Checking region: us-east-1
  [INFO] Successfully added new security group ingress rule
  [INFO] Successfully deleted old security group ingress rule
  [INFO] Checking region: us-east-2
  [INFO] No relevant ingress rules to change
  [INFO] Checking region: us-west-1
  [INFO] No relevant ingress rules to change
  [INFO] Checking region: us-west-2
  [INFO] No relevant ingress rules to change
  [INFO] Checking region: ap-south-1
  [INFO] No relevant ingress rules to change
  [INFO] Checking region: ap-northeast-1
  [INFO] No relevant ingress rules to change
  [INFO] Checking region: ap-northeast-2
  [INFO] No relevant ingress rules to change
  [INFO] Checking region: ap-southeast-1
  [INFO] No relevant ingress rules to change
  [INFO] Checking region: ap-southeast-2
  [INFO] No relevant ingress rules to change
  [INFO] Checking region: ca-central-1
  [INFO] No relevant ingress rules to change
  [INFO] Checking region: eu-central-1
  [INFO] No relevant ingress rules to change
  [INFO] Checking region: eu-west-1
  [INFO] Successfully added new security group ingress rule
  [INFO] Successfully deleted old security group ingress rule
  [INFO] Checking region: eu-west-2
  [INFO] No relevant ingress rules to change
  [INFO] Checking region: eu-west-3
  [INFO] No relevant ingress rules to change
  [INFO] Checking region: eu-north-1
  [INFO] Successfully added new security group ingress rule
  [INFO] Successfully deleted old security group ingress rule
  [INFO] Checking region: sa-east-1
  [INFO] No relevant ingress rules to change

* This example shows the CLI tool being used to update all security
  group rules in the regions: ``eu-west-1`` and ``eu-west-2``.

  .. code-block:: console
    :caption: This example shows that executing the ``update gcp --region europe-west2`` command will update all firewall and security policy rules in the ``europe-west2`` region.

    $ serverx update gco --region europe-west2
    [INFO] IP change detected
    [INFO] Old IP: 123.456.789
    [INFO] Current IP: 987.654.321
    [INFO] Checking account: Personal
    [INFO] Checking region: europe-west2
    [INFO] Successfully updated firewall ingress rule
    [INFO] Checking Cloud Armor policy: MyCloudArmorPolicy
    [INFO] Successfully updated Cloud Armor ingress rule
    