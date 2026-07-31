import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyUserDocument } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useVerifyUserDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyUserDocument,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getUserDocuments, variables.userId)],
      });
      // The rider detail embeds the document list, so it goes stale too.
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.riderDetail, variables.userId)],
      });
    },
  });
};
