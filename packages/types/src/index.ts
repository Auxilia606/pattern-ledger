import { z } from "zod";

export const transactionTypeSchema = z.enum(["IN", "OUT"]);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const categoryTypeSchema = z.enum(["INCOME", "EXPENSE"]);
export type CategoryType = z.infer<typeof categoryTypeSchema>;

export const categoryRuleMatchTypeSchema = z.enum(["EXACT", "CONTAINS", "REGEX"]);
export type CategoryRuleMatchType = z.infer<typeof categoryRuleMatchTypeSchema>;

export const autoMatchMethodSchema = z.enum(["RULE", "ML", "LLM"]);
export type AutoMatchMethod = z.infer<typeof autoMatchMethodSchema>;

export const naverProfileSchema = z.object({
  id: z.string(),
  email: z.string().optional(),
  name: z.string().optional(),
  profileImage: z.string().optional(),
});
export type NaverProfile = z.infer<typeof naverProfileSchema>;

export const naverAuthResultSchema = z.object({
  provider: z.literal("naver"),
  accessToken: z.string(),
  refreshToken: z.string(),
  profile: naverProfileSchema,
});
export type NaverAuthResult = z.infer<typeof naverAuthResultSchema>;
