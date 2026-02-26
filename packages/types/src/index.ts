import { z } from "zod";

export const transactionTypeSchema = z.enum(["IN", "OUT"]);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const categoryTypeSchema = z.enum(["INCOME", "EXPENSE"]);
export type CategoryType = z.infer<typeof categoryTypeSchema>;

export const categoryRuleMatchTypeSchema = z.enum(["EXACT", "CONTAINS", "REGEX"]);
export type CategoryRuleMatchType = z.infer<typeof categoryRuleMatchTypeSchema>;

export const autoMatchMethodSchema = z.enum(["RULE", "ML", "LLM"]);
export type AutoMatchMethod = z.infer<typeof autoMatchMethodSchema>;
