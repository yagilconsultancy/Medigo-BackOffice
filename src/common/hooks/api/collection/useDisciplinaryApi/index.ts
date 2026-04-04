import { toast } from 'sonner';
import {
  useCreateDisciplinaryAction,
  useReinstateDisciplinaryAction,
  useToggleCollapseDisciplinary,
} from '../../mutation';
import { CreateDisciplinaryActionRequest } from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useDisciplinaryApi = () => {
  const doCreateAction = useCreateDisciplinaryAction();
  const doReinstateAction = useReinstateDisciplinaryAction();
  const doToggleCollapse = useToggleCollapseDisciplinary();

  const createAction = async (
    payload: CreateDisciplinaryActionRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doCreateAction.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Disciplinary action created successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while creating the disciplinary action');
      }
    );

    return success;
  };

  const reinstateAction = async (payload: {
    actionId: string;
  }): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doReinstateAction.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Disciplinary action reinstated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error(
          'An error occurred while reinstating the disciplinary action'
        );
      }
    );

    return success;
  };

  const toggleCollapse = async (payload: {
    actionId: string;
  }): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doToggleCollapse.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Disciplinary action updated successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while updating the disciplinary action');
      }
    );

    return success;
  };

  return {
    createAction,
    reinstateAction,
    toggleCollapse,
  };
};
