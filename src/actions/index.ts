import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const content = {
    toDns: {
        title: "Nouveau message depuis le site",
        row: (label: string, value: string) => `
            <tr style="background-color: #f9f9f9;">
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>${label}:</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${value}</td>
            </tr>
        `,
    },
    toClient: {
        object: "🌲 Merci pour votre message",
        title: "Merci pour votre message",
        body: "Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais. Voici un résumé de ce que vous nous avez envoyé :",
        thanks: "Nous vous remercions pour votre patience et reviendrons vers vous dès que possible.",
        footer: "Cordialement,<br>L'équipe Alabordarbre",
    },
};

const from = "[Alabordarbre.fr] <noreply@resend.alabordarbre.fr>";
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
            const emailLabel = email.split("@")[0];
            const { data, error } = await resend.batch.send([
                {
                    from,
                    to: ["contact@alabordarbre.fr"],
                    subject: `[Alabordarbre.fr] : ${emailLabel}`,
                    html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #4CAF50;">${content.toDns.title}</h2>
                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                            ${content.toDns.row("Email", email)}
                            ${content.toDns.row("Tel", tel || "N/A")}
                            ${content.toDns.row("Message", message)}
                            ${content.toDns.row("Recontact", recontact || "NON")}
                        </table>
                        <p style="font-size: 14px; color: #555;">Cette email est automatique 🍷</p>
                    </div>
                    `,
                },
                {
                    from,
                    to: [email],
                    subject: `${content.toClient.object}, ${emailLabel}`,
                    html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #7b8ec3;">${content.toClient.title}</h2>
                    <p>Bonjour !</p>
                    <p>${content.toClient.body}</p>
                    <div style="background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd; margin: 20px 0;">
                        <p><strong>Message :</strong> ${message}</p>
                        <p><strong>Téléphone :</strong> ${tel || "N/A"}</p>
                    </div>
                    <p>${content.toClient.footer}</p>
                    <p style="font-size: 14px; color: #555;">${content.toClient.footer}</p>
                </div>
            `,
                },
            ]);

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
