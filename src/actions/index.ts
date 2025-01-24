import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
    send: defineAction({
        accept: "form",
        input: z.object({
            email: z.string().email(),
            tel: z.string().optional(),
            message: z.string(),
            recontact: z.literal("recontact").optional(),
        }),
        handler: async ({ email, message, recontact, tel }) => {
            const { data, error } = await resend.emails.send({
                from: "Acme <noreply@resend.alabordarbre.fr>",
                to: ["contact@alabordarbre.fr"],
                subject: "From the website",
                html: `
                <p>Email: ${email}</p>
                <p>Tel: ${tel}</p>
                <p>Message: ${message}</p>
                <p>Recontact: ${recontact}</p>
                `,
            });

            if (error) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: error.message,
                });
            }

            return data;
        },
    }),
};
