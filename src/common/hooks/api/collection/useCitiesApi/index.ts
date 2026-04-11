import { toast } from 'sonner';
import {
  useCreateCity,
  useUpdateCity,
  useToggleCity,
  useDeleteCity,
} from '../../mutation';
import { tryExecute, extractResponseErrors } from '../../../../utils';
import {
  CityCreateRequest,
  UpdateCityPayload,
  ToggleCityPayload,
  DeleteCityPayload,
} from '../../../../types';

export const useCitiesApi = () => {
  const doCreateCity = useCreateCity();
  const doUpdateCity = useUpdateCity();
  const doToggleCity = useToggleCity();
  const doDeleteCity = useDeleteCity();

  const createCity = async (payload: CityCreateRequest): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doCreateCity.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('City created successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating the city');
      }
    );
    return success;
  };

  const updateCity = async (payload: UpdateCityPayload): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doUpdateCity.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('City updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating the city');
      }
    );
    return success;
  };

  const toggleCity = async (payload: ToggleCityPayload): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doToggleCity.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success(
            `City ${payload.is_active ? 'activated' : 'deactivated'} successfully`
          );
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while toggling the city');
      }
    );
    return success;
  };

  const deleteCity = async (payload: DeleteCityPayload): Promise<boolean> => {
    let success = false;
    await tryExecute(
      () => doDeleteCity.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;
        if (responseData.success) {
          success = true;
          toast.success('City deleted successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while deleting the city');
      }
    );
    return success;
  };

  return {
    createCity,
    updateCity,
    toggleCity,
    deleteCity,
  };
};
