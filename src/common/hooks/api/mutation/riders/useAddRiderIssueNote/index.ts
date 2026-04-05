import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addRiderIssueNote } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useAddRiderIssueNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRiderIssueNote,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.ridersIssuesDetail, variables.issueId)],
      });
    },
  });
};
