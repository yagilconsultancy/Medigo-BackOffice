import { toast } from 'sonner';
import {
  useUpdateServiceTypeConfig,
  useUpdateRoutePricing,
  useCreateSurchargeRule,
  useUpdateSurchargeRule,
  useDeleteSurchargeRule,
  useCreatePackage,
  useUpdatePackage,
  useTogglePackage,
  useSaveConfiguration,
  useUpdateCommissionConfig,
  useUpdateCancellationPolicies,
} from '../../mutation';
import {
  ServiceTypeConfigUpdate,
  RoutePricingUpdate,
  SurchargeRuleCreate,
  SurchargeRuleUpdate,
  RidePackageCreate,
  RidePackageUpdate,
  CreateRateCardRequest,
  CommissionConfigUpdate,
  CancellationPolicyBulkUpdate,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const usePaymentPricingApi = () => {
  const doUpdateServiceTypeConfig = useUpdateServiceTypeConfig();
  const doUpdateRoutePricing = useUpdateRoutePricing();
  const doCreateSurchargeRule = useCreateSurchargeRule();
  const doUpdateSurchargeRule = useUpdateSurchargeRule();
  const doDeleteSurchargeRule = useDeleteSurchargeRule();
  const doCreatePackage = useCreatePackage();
  const doUpdatePackage = useUpdatePackage();
  const doTogglePackage = useTogglePackage();
  const doSaveConfiguration = useSaveConfiguration();
  const doUpdateCommissionConfig = useUpdateCommissionConfig();
  const doUpdateCancellationPolicies = useUpdateCancellationPolicies();

  const updateServiceTypeConfig = async (
    serviceType: string,
    payload: ServiceTypeConfigUpdate
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdateServiceTypeConfig.mutateAsync({ serviceType, payload }),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Service type configuration updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error(
          'An error occurred while updating service type configuration'
        );
      }
    );

    return success;
  };

  const updateRoutePricing = async (
    serviceType: string,
    payload: RoutePricingUpdate
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdateRoutePricing.mutateAsync({ serviceType, payload }),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Route pricing updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating route pricing');
      }
    );

    return success;
  };

  const createSurchargeRule = async (
    payload: SurchargeRuleCreate
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doCreateSurchargeRule.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Surcharge rule created successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating surcharge rule');
      }
    );

    return success;
  };

  const updateSurchargeRule = async (
    ruleId: string,
    payload: SurchargeRuleUpdate
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdateSurchargeRule.mutateAsync({ ruleId, payload }),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Surcharge rule updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating surcharge rule');
      }
    );

    return success;
  };

  const deleteSurchargeRule = async (ruleId: string): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doDeleteSurchargeRule.mutateAsync(ruleId),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Surcharge rule deleted successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while deleting surcharge rule');
      }
    );

    return success;
  };

  const createPackage = async (
    payload: RidePackageCreate
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doCreatePackage.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Package created successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating package');
      }
    );

    return success;
  };

  const updatePackage = async (
    packageId: string,
    payload: RidePackageUpdate
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdatePackage.mutateAsync({ packageId, payload }),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Package updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating package');
      }
    );

    return success;
  };

  const togglePackage = async (packageId: string): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doTogglePackage.mutateAsync(packageId),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Package status toggled successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while toggling package status');
      }
    );

    return success;
  };

  const saveConfiguration = async (
    payload: CreateRateCardRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doSaveConfiguration.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Configuration saved successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while saving configuration');
      }
    );

    return success;
  };

  const updateCommissionConfig = async (
    payload: CommissionConfigUpdate
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdateCommissionConfig.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Commission configuration updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error(
          'An error occurred while updating commission configuration'
        );
      }
    );

    return success;
  };

  const updateCancellationPolicies = async (
    payload: CancellationPolicyBulkUpdate
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doUpdateCancellationPolicies.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Cancellation policies updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error(
          'An error occurred while updating cancellation policies'
        );
      }
    );

    return success;
  };

  return {
    updateServiceTypeConfig,
    updateRoutePricing,
    createSurchargeRule,
    updateSurchargeRule,
    deleteSurchargeRule,
    createPackage,
    updatePackage,
    togglePackage,
    saveConfiguration,
    updateCommissionConfig,
    updateCancellationPolicies,
  };
};
