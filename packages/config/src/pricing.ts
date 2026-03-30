export const saasPricingModel = {
  currency: "EUR",
  internalSeatMonthly: 89,
  externalClientMonthly: 14,
  notes: {
    internal: "For advisers, coordinators, and internal operations seats.",
    external: "For client, family office, or external stakeholder access.",
  },
} as const

export function calculateWorkspacePricing(internalSeats: number, externalAccounts: number) {
  return {
    internalSeats,
    externalAccounts,
    internalTotal: internalSeats * saasPricingModel.internalSeatMonthly,
    externalTotal: externalAccounts * saasPricingModel.externalClientMonthly,
    total:
      internalSeats * saasPricingModel.internalSeatMonthly +
      externalAccounts * saasPricingModel.externalClientMonthly,
  }
}
