import { useQuery } from "@tanstack/react-query";
import { resolveRoute, ROUTES } from "../../../../../constants";
import { getActivityAnalytics } from "../../../../../services";

export const useGetActivityAnalytics = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getActivityKPI)],
    queryFn: () => getActivityAnalytics().then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error) => {
      // Don't retry on 403 errors
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 403) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
};
