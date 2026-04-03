import { useMutation } from "@tanstack/react-query";
import { getExportActivity } from "../../../../../services";

export const useExportActivity = () => {
  return useMutation({
    mutationFn: getExportActivity,
  });
};
