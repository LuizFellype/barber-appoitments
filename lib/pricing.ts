/** Fixed platform fee charged on every scheduled appointment, on top of the
 * services total, to cover application maintenance. Snapshotted onto
 * Appointment.maintenanceFeeCents at booking time (mirrors the Service ->
 * AppointmentService price-snapshot pattern) so later changes to this
 * constant don't alter historical appointments.
 */
export const MAINTENANCE_FEE_CENTS = 200
