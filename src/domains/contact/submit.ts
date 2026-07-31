import {
  configureNocoClient,
  contactmessageCreate,
} from "@/server/nocodb";

export type ContactIntake = {
  name: string;
  contact: string;
  message: string;
  ipHash?: string | null;
};

/** Persist a verified contact message (Turnstile already passed). */
export async function createContactMessage(input: ContactIntake) {
  configureNocoClient();
  const { data, error } = await contactmessageCreate({
    body: {
      Name: input.name,
      Contact: input.contact,
      Message: input.message,
      Status: "new",
      TurnstileOk: true,
      IpHash: input.ipHash ?? null,
    },
  });
  if (error) throw error;
  return data;
}
