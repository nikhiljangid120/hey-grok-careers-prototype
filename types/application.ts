export const applicationStatuses = [
  "SUBMITTED",
  "REVIEWING",
  "REJECTED",
  "HIRED",
] as const;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export type SubmissionSuccess = {
  ok: true;
  demo: boolean;
  applicationId: string;
  jobSlug: string;
  jobTitle: string;
  submittedAt: string;
};

export type SubmissionFailure = {
  ok: false;
  code:
    | "INVALID_INPUT"
    | "DUPLICATE_APPLICATION"
    | "UPLOAD_FAILED"
    | "DATABASE_FAILED"
    | "CONFIGURATION_ERROR"
    | "UNKNOWN_ERROR";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type SubmissionResponse = SubmissionSuccess | SubmissionFailure;