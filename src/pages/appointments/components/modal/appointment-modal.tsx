import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../../../auth/store/store";
import { getStatusInfo } from "../../features/status";
import type { BackendRepairStatus, TechnicianOption } from "../../interface";
import { appointmentService } from "../../services/appointment.service";
import { useAppointmentStore } from "../../store";
import { mapBookingToAppointment } from "../../utils/mapper";
import { useAppointmentModalStore } from "./store";
import { useToast } from "../../../../global/hooks/useToast";

/* ─── Icons ─── */
const IconX       = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconUser    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconPhone   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.58 4.9 2 2 0 0 1 3.55 2.73h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 5.69 5.69l1.06-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/></svg>;
const IconMail    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IconStore   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconWrench  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;

/* ─── Shared input styles ─── */
const inputCls = "w-full rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-gray-900 dark:text-white ...";
const selectCls = inputCls + " cursor-pointer";

/* ─── Info row ─── */
const InfoRow = ({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) => (
  <div>
    <div className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 mb-1">{label}</div>
    <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-white/80">
      <span className="text-gray-400 dark:text-white/25">{icon}</span>
      {children}
    </div>
  </div>
);

/* ─── Section card ─── */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.02] p-4 space-y-3">
    <div className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">{title}</div>
    {children}
  </div>
);

/* ─── Field label ─── */
const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30 mb-1.5">{children}</div>
);

/* ─── Action button variants ─── */
const Btn = ({ onClick, disabled, color, children }: { onClick: () => void; disabled?: boolean; color: string; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-1.5 rounded-xl text-white text-sm font-semibold px-4 py-2 border-none cursor-pointer transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${color}`}
  >
    {children}
  </button>
);

/* ════════════════════════════════════════════════════════ */
const AppointmentModal = () => {
  const open = useAppointmentModalStore((state) => state.open);
  const setOpen = useAppointmentModalStore((state) => state.setOpen);
  const selectedAppointment = useAppointmentModalStore((state) => state.selectedAppointment);
  const setSelectedAppointment = useAppointmentModalStore((state) => state.setSelectedAppointment);
  const setAppointments = useAppointmentStore((state) => state.setAppointments);

  const userId = useAuthStore((state) => state.userId);
  const role = useAuthStore((state) => state.role);
  const tenantId = useAuthStore((state) => state.tenantId);
  const fullName = useAuthStore((state) => state.fullName) || undefined;
  const isCustomer = role === "CUSTOMER";

  const toast = useToast();
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [technicianNote, setTechnicianNote] = useState("");
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [statusRemarks, setStatusRemarks] = useState("");
  const [nextStatus, setNextStatus] = useState<BackendRepairStatus | "">("");
  const [finalPrice, setFinalPrice] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [cancelRemarks, setCancelRemarks] = useState("");
  const [technicians, setTechnicians] = useState<TechnicianOption[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!selectedAppointment) return;
    setEstimatedPrice(selectedAppointment.estimatedPrice?.toString() || "");
    setTechnicianNote(selectedAppointment.technicianNote || "");
    setSelectedTechnicianId(selectedAppointment.assignedTechnicianId?.toString() || "");
    setFinalPrice(selectedAppointment.finalPrice?.toString() || selectedAppointment.estimatedPrice?.toString() || "");
    setPaymentMethod(selectedAppointment.paymentMethod || "CASH");
    setStatusRemarks(""); setCancelRemarks(""); setNextStatus("");
  }, [selectedAppointment]);

  useEffect(() => {
    const loadTechs = async () => {
      if (!open || !selectedAppointment || isCustomer) return;
      const shopId = tenantId || selectedAppointment.shopId;
      if (!shopId) return;
      try { setTechnicians(await appointmentService.getTechniciansForShop(shopId)); }
      catch { setTechnicians([]); }
    };
    loadTechs();
  }, [open, selectedAppointment, isCustomer, tenantId]);

  const refreshAppointments = async () => {
    const data = await appointmentService.getAppointments({ userId, role, tenantId });
    const mapped = data.map(mapBookingToAppointment);
    setAppointments(mapped);
    if (selectedAppointment) setSelectedAppointment(mapped.find((i) => i.id === selectedAppointment.id) || null);
  };

  const availableNextStatuses = useMemo((): BackendRepairStatus[] => {
    if (!selectedAppointment) return [];
    switch (selectedAppointment.backendStatus) {
      case "CUSTOMER_CONFIRMED": return ["CONFIRMED"];
      case "CONFIRMED": return ["IN_PROGRESS"];
      case "IN_PROGRESS": return ["COMPLETED"];
      default: return [];
    }
  }, [selectedAppointment]);

  const runAction = async (action: () => Promise<void>, successMessage: string) => {
    try {
      setBusy(true);
      await action();
      await refreshAppointments();
      toast.success(successMessage);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Action failed.");
    } finally {
      setBusy(false);
    }
  };

  if (!open || !selectedAppointment) return null;

  const statusInfo = getStatusInfo(selectedAppointment.status);
  const StatusIcon = statusInfo.icon;

  const canCustomerConfirm   = isCustomer && selectedAppointment.backendStatus === "ESTIMATE_PROVIDED";
  const canCustomerPay       = isCustomer && selectedAppointment.backendStatus === "COMPLETED";
  const canCustomerCancel    = isCustomer && !["COMPLETED", "PAID", "CANCELLED"].includes(selectedAppointment.backendStatus);
  const canAdminProvideEst   = !isCustomer && selectedAppointment.backendStatus === "REQUESTED";
  const canAdminAssignTech   = !isCustomer && !["COMPLETED", "PAID", "CANCELLED"].includes(selectedAppointment.backendStatus);
  const canAdminCancel       = !isCustomer && !["COMPLETED", "PAID", "CANCELLED"].includes(selectedAppointment.backendStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0f1829] shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06] bg-white dark:bg-[#0f1829]">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Appointment Details</h3>
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusInfo.color}`}>
              <StatusIcon size={11} />{statusInfo.label}
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white border-none cursor-pointer transition"
          ><IconX /></button>
        </div>

        <div className="p-6 space-y-5">

          {/* Info grid */}
          <div className="grid gap-5 md:grid-cols-2">
            <Section title="Customer Info">
              <InfoRow icon={<IconUser />} label="Name">{selectedAppointment.customerName}</InfoRow>
              <InfoRow icon={<IconPhone />} label="Phone">{selectedAppointment.phone}</InfoRow>
              <InfoRow icon={<IconMail />} label="Email">{selectedAppointment.email || "N/A"}</InfoRow>
              <InfoRow icon={<IconStore />} label="Shop">{selectedAppointment.shopName}</InfoRow>
            </Section>

            <Section title="Appointment Info">
              <InfoRow icon={<IconWrench />} label="Device">{selectedAppointment.deviceType} — {selectedAppointment.deviceModel}</InfoRow>
              <InfoRow icon={<IconStore />} label="Date">{selectedAppointment.appointmentDate}</InfoRow>
              <InfoRow icon={<IconStore />} label="Time">{selectedAppointment.appointmentTime}</InfoRow>
              <InfoRow icon={<IconStore />} label="Service Mode">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${selectedAppointment.serviceMode === "HOME_PICKUP" ? "bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40"}`}>
                  {selectedAppointment.serviceMode === "HOME_PICKUP" ? "Home Pickup" : "In Store"}
                </span>
              </InfoRow>
            </Section>
          </div>

          {/* Issue */}
          <div>
            <FieldLabel>Issue Description</FieldLabel>
            <div className="rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] px-4 py-3 text-sm text-gray-800 dark:text-white/70">
              {selectedAppointment.issueDescription}
            </div>
          </div>

          {selectedAppointment.serviceMode === "HOME_PICKUP" && (
            <div>
              <FieldLabel>Pickup Address</FieldLabel>
              <div className="rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.03] px-4 py-3 text-sm text-gray-800 dark:text-white/70">
                {selectedAppointment.pickupAddress || "N/A"}
              </div>
            </div>
          )}

          {/* Estimate + Payment */}
          <div className="grid gap-4 md:grid-cols-2">
            <Section title="Estimate & Technician">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500 dark:text-white/40">Estimated Price</span><span className="font-semibold text-gray-900 dark:text-white">{selectedAppointment.estimatedPrice != null ? `Rs. ${selectedAppointment.estimatedPrice}` : "—"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-white/40">Customer Approved</span><span className={`font-semibold ${selectedAppointment.customerApprovedEstimate ? "text-emerald-500" : "text-gray-400 dark:text-white/30"}`}>{selectedAppointment.customerApprovedEstimate ? "Yes" : "No"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-white/40">Assigned Technician</span><span className="font-semibold text-gray-900 dark:text-white">{selectedAppointment.assignedTechnician || "—"}</span></div>
                {selectedAppointment.technicianNote && <div className="pt-2 border-t border-gray-200 dark:border-white/[0.06] text-xs text-gray-500 dark:text-white/40">{selectedAppointment.technicianNote}</div>}
              </div>
            </Section>

            <Section title="Payment">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500 dark:text-white/40">Final Price</span><span className="font-semibold text-gray-900 dark:text-white">{selectedAppointment.finalPrice != null ? `Rs. ${selectedAppointment.finalPrice}` : "—"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-white/40">Paid</span><span className={`font-semibold ${selectedAppointment.paid ? "text-emerald-500" : "text-gray-400 dark:text-white/30"}`}>{selectedAppointment.paid ? "Yes" : "No"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-white/40">Method</span><span className="font-semibold text-gray-900 dark:text-white">{selectedAppointment.paymentMethod || "—"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-white/40">Paid At</span><span className="font-semibold text-gray-900 dark:text-white">{selectedAppointment.paidAt || "—"}</span></div>
              </div>
            </Section>
          </div>

          {/* Alerts */}

          {/* ── Admin actions ── */}
          {!isCustomer && (
            <>
              {/* Assign technician */}
              <Section title="Assign Technician">
                <div className="flex gap-3 flex-col sm:flex-row">
                  <select value={selectedTechnicianId} onChange={(e) => setSelectedTechnicianId(e.target.value)} className={selectCls + " flex-1"}>
                    <option value="">Select technician…</option>
                    {technicians.map((t) => <option key={t.id} value={t.id}>{t.fullName} — {t.specialization}</option>)}
                  </select>
                  <Btn
                    disabled={busy || !canAdminAssignTech || !selectedTechnicianId}
                    color="bg-slate-600 hover:bg-slate-700"
                    onClick={() => runAction(
                      () => appointmentService.assignTechnician(selectedAppointment.id, { technicianId: Number(selectedTechnicianId), changedBy: fullName, remarks: statusRemarks || undefined }),
                      "Technician assigned successfully."
                    )}
                  >Assign Technician</Btn>
                </div>
              </Section>

              {/* Provide estimate */}
              {canAdminProvideEst && (
                <Section title="Provide Estimate">
                  <div className="grid gap-3 lg:grid-cols-2">
                    <div>
                      <FieldLabel>Estimated Price</FieldLabel>
                      <input type="number" min="0" value={estimatedPrice} onChange={(e) => setEstimatedPrice(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <FieldLabel>Technician Note</FieldLabel>
                      <textarea value={technicianNote} onChange={(e) => setTechnicianNote(e.target.value)} rows={2} className={inputCls + " resize-none"} />
                    </div>
                  </div>
                  <Btn
                    disabled={busy || !estimatedPrice}
                    color="bg-amber-500 hover:bg-amber-600"
                    onClick={() => runAction(
                      () => appointmentService.provideEstimate(selectedAppointment.id, { estimatedPrice: Number(estimatedPrice), technicianNote, changedBy: fullName }),
                      "Estimate sent to customer."
                    )}
                  >Send Estimate</Btn>
                </Section>
              )}

              {/* Update status */}
              {availableNextStatuses.length > 0 && (
                <Section title="Update Status">
                  <div className="flex gap-3 flex-col sm:flex-row">
                    <select value={nextStatus} onChange={(e) => setNextStatus(e.target.value as BackendRepairStatus)} className={selectCls}>
                      <option value="">Select next status…</option>
                      {availableNextStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input value={statusRemarks} onChange={(e) => setStatusRemarks(e.target.value)} placeholder="Remarks (optional)" className={inputCls} />
                    <Btn
                      disabled={busy || !nextStatus}
                      color="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      onClick={() => runAction(
                        () => appointmentService.updateStatus(selectedAppointment.id, { status: nextStatus as BackendRepairStatus, changedBy: fullName, remarks: statusRemarks || undefined }),
                        `Status updated to ${nextStatus}.`
                      )}
                    >Update</Btn>
                  </div>
                </Section>
              )}
            </>
          )}

          {/* ── Customer: confirm estimate ── */}
          {canCustomerConfirm && (
            <Section title="Confirm Estimate">
              <p className="text-sm text-gray-600 dark:text-white/50">Review the estimate above, then confirm to proceed with the repair.</p>
              <Btn
                disabled={busy || !userId}
                color="bg-emerald-500 hover:bg-emerald-600"
                onClick={() => runAction(
                  () => appointmentService.confirmEstimate(selectedAppointment.id, { userId: Number(userId), changedBy: fullName }),
                  "Estimate confirmed successfully."
                )}
              >Confirm Estimate</Btn>
            </Section>
          )}

          {/* ── Customer: pay ── */}
          {canCustomerPay && (
            <Section title="Make Payment">
              <div className="flex gap-3 flex-col sm:flex-row">
                <input type="number" min="0" value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)} placeholder="Final price" className={inputCls} />
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={selectCls}>
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="ESEWA">eSewa</option>
                  <option value="KHALTI">Khalti</option>
                </select>
                <Btn
                  disabled={busy || !finalPrice}
                  color="bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => runAction(
                    () => appointmentService.pay(selectedAppointment.id, { finalPrice: Number(finalPrice), paymentMethod, changedBy: fullName }),
                    "Payment completed successfully."
                  )}
                >Pay Now</Btn>
              </div>
            </Section>
          )}

          {/* ── Cancel ── */}
          {(canCustomerCancel || canAdminCancel) && (
            <Section title="Cancel Booking">
              <div className="flex gap-3 flex-col sm:flex-row">
                <input value={cancelRemarks} onChange={(e) => setCancelRemarks(e.target.value)} placeholder="Reason for cancellation…" className={inputCls + " flex-1"} />
                {canCustomerCancel && (
                  <Btn
                    disabled={busy || !userId}
                    color="bg-red-500 hover:bg-red-600"
                    onClick={() => runAction(
                      () => appointmentService.cancelAsCustomer(selectedAppointment.id, { userId: Number(userId), changedBy: fullName, remarks: cancelRemarks || undefined }),
                      "Booking cancelled successfully."
                    )}
                  >Cancel Booking</Btn>
                )}
                {canAdminCancel && (
                  <Btn
                    disabled={busy}
                    color="bg-red-500 hover:bg-red-600"
                    onClick={() => runAction(
                      () => appointmentService.cancelAsAdmin(selectedAppointment.id, { changedBy: fullName, remarks: cancelRemarks || undefined }),
                      "Booking cancelled successfully."
                    )}
                  >Admin Cancel</Btn>
                )}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;