export type PermissionId =
  | "ai.provider.read"
  | "ai.provider.write"
  | "ai.chat.use"
  | "ai.qa.use"
  | "ai.report.run";

export type PermissionSet = ReadonlySet<PermissionId>;
