"use client";

import { Stack } from "@mui/material"
import { AppDashboardLayout } from "../../modules/partials/AppDashboardLayout"
import { DashboardTitleAndDesc } from "../../modules/components"

export const BookingPage = () => {
    return (
        <AppDashboardLayout>
            <Stack spacing={3}>
                <DashboardTitleAndDesc
                title="Booking Management"
                desc={`Review, approve, and manage all patient transport bookings`}
                />
            </Stack>
        </AppDashboardLayout>
    )
}
