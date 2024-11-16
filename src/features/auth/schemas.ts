import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const verificationSchema = toTypedSchema(z.object({
  code: z.array(z.coerce.string()).length(6, { message: 'Invalid input' }),
}));

export const loginSchema = toTypedSchema(z.object({
  emailAddress: z.string().email(),
  password: z.string().min(8, "Required"),
}));

export const registerSchema = toTypedSchema(z.object({
  firstName: z.string().min(2, "Minimum of 2 characters required"),
  lastName: z.string().min(2, "Minimum of 2 characters required"),
  emailAddress: z.string().email(),
  password: z.string().min(8, "Minimum of 8 characters required"),
  confirmPassword: z.string().min(8, "Minimum of 8 characters required"),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirmPassword']
    });
  }
}));

