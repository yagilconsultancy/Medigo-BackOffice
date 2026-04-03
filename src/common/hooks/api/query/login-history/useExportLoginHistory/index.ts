import { useMutation } from "@tanstack/react-query";
import { getExportLoginHistory } from "../../../../../services";

export const useExportLoginHistory = () => {
  return useMutation({
    mutationFn: getExportLoginHistory,
  });
};
