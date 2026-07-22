import { toast } from 'sonner';
import {
  useApproveBooking,
  useDeclineBooking,
  useAssignDriverToBooking,
  useReassignDriver,
  useAdminCancelTrip,
  useDeleteBooking,
  useAddBookingNote,
} from '../../mutation';
import {
  ApproveBookingRequest,
  DeclineBookingRequest,
  AssignDriverRequest,
  ReassignDriverRequest,
  CancelTripRequest,
  CreateAdminNoteRequest,
} from '../../../../types';
import { extractResponseErrors, tryExecute } from '../../../../utils';

export const useBookingsApi = () => {
  const doApproveBooking = useApproveBooking();
  const doDeclineBooking = useDeclineBooking();
  const doAssignDriver = useAssignDriverToBooking();
  const doReassignDriver = useReassignDriver();
  const doCancelTrip = useAdminCancelTrip();
  const doDeleteBooking = useDeleteBooking();
  const doAddNote = useAddBookingNote();

  const approveBooking = async (
    payload: { rideId: string } & ApproveBookingRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doApproveBooking.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Booking approved successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while approving the booking');
      }
    );

    return success;
  };

  const declineBooking = async (
    payload: { rideId: string } & DeclineBookingRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doDeclineBooking.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Booking declined successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while declining the booking');
      }
    );

    return success;
  };

  const assignDriverToBooking = async (
    payload: { rideId: string } & AssignDriverRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doAssignDriver.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Driver assigned to booking successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while assigning the driver');
      }
    );

    return success;
  };

  const reassignDriver = async (
    payload: { rideId: string } & ReassignDriverRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doReassignDriver.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Driver reassigned successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while reassigning the driver');
      }
    );

    return success;
  };

  const cancelTrip = async (
    payload: { rideId: string } & CancelTripRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doCancelTrip.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Trip cancelled successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while cancelling the trip');
      }
    );

    return success;
  };

  const deleteBooking = async (payload: {
    rideId: string;
  }): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doDeleteBooking.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Booking deleted successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while deleting the booking');
      }
    );

    return success;
  };

  const addNote = async (
    payload: { rideId: string } & CreateAdminNoteRequest
  ): Promise<boolean> => {
    let success = false;

    await tryExecute(
      () => doAddNote.mutateAsync(payload),
      async (response) => {
        const responseData = response.data;

        if (responseData.success) {
          success = true;
          toast.success('Note added successfully');
        } else {
          toast.error(extractResponseErrors(responseData));
        }
      },
      async () => {
        toast.error('An error occurred while adding the note');
      }
    );

    return success;
  };

  return {
    approveBooking,
    declineBooking,
    assignDriverToBooking,
    reassignDriver,
    cancelTrip,
    deleteBooking,
    addNote,
  };
};
