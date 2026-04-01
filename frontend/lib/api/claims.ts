"use client";

import { useAppStore } from "@/store/useAppStore";
import { notifyClaimSubmitted, notifyDecisionMade, notifyDocumentRequested, notifyDocumentUploaded } from "@/lib/api/notifications";
import type { Claim, ClaimStatus, Comment, TimelineEntry, UploadedDocument, UserRole } from "@/types";

const buildId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;

export const buildNewClaim = (data: Partial<Claim>): Claim => {
  const submittedAt = new Date();
  const processingStartedAt = new Date(submittedAt.getTime() + 1000);

  return {
    id: buildId("CLM"),
    submittedAt: submittedAt.toISOString(),
    status: "pending",
    riskScore: Math.floor(Math.random() * 100),
    timeline: [
      { label: "Claim submitted by hospital", time: submittedAt.toISOString(), actor: "hospital" },
      { label: "AI pipeline processing started", time: processingStartedAt.toISOString(), actor: "system" },
    ],
    aiResults: {
      policy: { status: "pass", reason: "Room rent within daily limit per Section 3.1" },
      medical: { status: "flag", reason: "ECG billed - no cardiac diagnosis present" },
      cross: { status: "pass", reason: "Patient records cross-validated" },
    },
    documents: [],
    comments: [],
    caseType: "planned",
    diagnosis: "",
    icdCode: "",
    amount: 0,
    patientId: "",
    patientName: "",
    hospital: "",
    ...data,
  } as Claim;
};

export const buildDecisionLetter = (claim: Claim): string => {
  const flags = [
    claim.aiResults.policy.status === "flag" ? `Policy: ${claim.aiResults.policy.reason}` : null,
    claim.aiResults.medical.status === "flag" ? `Medical: ${claim.aiResults.medical.reason}` : null,
    claim.aiResults.cross.status === "flag" ? `Validation: ${claim.aiResults.cross.reason}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `Dear ${claim.patientName},\n\nYour claim ${claim.id} for Rs ${Number(claim.amount).toLocaleString("en-IN")} at ${claim.hospital} has been ${claim.status === "under_review" ? "placed under review" : claim.status}.\n\n${flags ? `Notes:\n${flags}\n\n` : ""}Contact your insurer for queries.\n\nRegards,\nClaimHeart Adjudication System`;
};

export const simulateOCR = () => ({
  diagnosis: "Dengue Fever",
  icdCode: "A90",
  admissionDate: "2025-03-18",
  dischargeDate: "2025-03-22",
  totalAmount: "Rs 1,24,500",
  note: "NS1 antigen positive. Platelet count 45,000.",
});

export const getClaims = async () => {
  return useAppStore.getState().claims;
};

export const getNotifications = async () => {
  return useAppStore.getState().notifications;
};

export const getClaimById = async (id: string) => {
  return useAppStore.getState().claims.find((claim) => claim.id === id) ?? null;
};

export const getClaimsByPatient = async (patientId: string) => {
  return useAppStore.getState().claims.filter((claim) => claim.patientId === patientId);
};

export const getClaimsByHospital = async (hospital: string) => {
  return useAppStore.getState().claims.filter((claim) => claim.hospital === hospital);
};

export const submitClaim = async (claimInput: Partial<Claim>) => {
  const claim = buildNewClaim(claimInput);
  const store = useAppStore.getState();
  store.addClaim(claim);
  notifyClaimSubmitted(claim);
  return claim;
};

export const recordDecision = async (id: string, status: ClaimStatus, note?: string) => {
  const store = useAppStore.getState();
  const claim = store.claims.find((entry) => entry.id === id);
  if (!claim) {
    return null;
  }

  const timelineLabel =
    status === "approved"
      ? "Approved by insurer"
      : status === "denied"
        ? "Denied by insurer"
        : "Placed under manual review by insurer";

  const timeline: TimelineEntry[] = [
    ...claim.timeline,
    { label: timelineLabel, time: new Date().toISOString(), actor: "insurer" },
  ];

  store.updateClaim(id, { status, timeline, decisionNote: note });
  const updatedClaim = { ...claim, status, timeline, decisionNote: note };
  notifyDecisionMade(updatedClaim, status, note);
  return updatedClaim;
};

export const requestMoreDocuments = async (id: string, requestNote: string) => {
  const store = useAppStore.getState();
  const claim = store.claims.find((entry) => entry.id === id);
  if (!claim) {
    return null;
  }

  const timeline = [
    ...claim.timeline,
    { label: `Documents requested by insurer: ${requestNote}`, time: new Date().toISOString(), actor: "insurer" as const },
  ];

  store.updateClaim(id, { status: "under_review", timeline, decisionNote: requestNote });
  const updatedClaim = { ...claim, status: "under_review" as ClaimStatus, timeline, decisionNote: requestNote };
  notifyDocumentRequested(updatedClaim, requestNote);
  return updatedClaim;
};

export const addClaimDocument = async (id: string, document: UploadedDocument, uploaderRole: UserRole) => {
  const store = useAppStore.getState();
  const claim = store.claims.find((entry) => entry.id === id);
  if (!claim) {
    return null;
  }

  const documents = [...claim.documents, document];
  const timeline = [
    ...claim.timeline,
    { label: `Document uploaded by ${uploaderRole}: ${document.name}`, time: new Date().toISOString(), actor: uploaderRole },
  ];

  store.updateClaim(id, { documents, timeline });
  const updatedClaim = { ...claim, documents, timeline };
  notifyDocumentUploaded(updatedClaim, document.name, uploaderRole);
  return updatedClaim;
};

export const addClaimComment = async (
  id: string,
  payload: { text: string; author: string; role: UserRole; visibleTo: Comment["visibleTo"] },
) => {
  const store = useAppStore.getState();
  const claim = store.claims.find((entry) => entry.id === id);
  if (!claim) {
    return null;
  }

  const comment: Comment = {
    id: buildId("COM"),
    text: payload.text,
    author: payload.author,
    role: payload.role,
    time: new Date().toISOString(),
    visibleTo: payload.visibleTo,
  };

  const comments = [comment, ...claim.comments];
  const timeline = [
    ...claim.timeline,
    { label: `Comment added by ${payload.role}`, time: new Date().toISOString(), actor: payload.role },
  ];

  store.updateClaim(id, { comments, timeline });
  return { ...claim, comments, timeline };
};
