import { sendEmail } from "./sendEmail";
import { notificationTemplate } from "./templates/notificationTemplate";

type RequestType = "booking" | "consulting" | "prototyping" | "message";
type Audience = "user" | "admin";

type NotifyArgs = {
  type: RequestType;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
  payload?: Record<string, any>;
  id?: string;
  adminEmail?: string;
};

// Remove identity fields from payload before using/logging
function sanitizePayload(payload?: Record<string, any>) {
  if (!payload) return {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userName, name, email, ...rest } = payload;
  return rest;
}

const buildTemplate = (
  audience: "user" | "admin",
  args: NotifyArgs
): string => {
  const { type, user, payload = {}, id } = args;
  const safePayload = sanitizePayload(payload);
  const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
  const message =
    audience === "user"
      ? `Thanks${user?.name ? `, ${user.name}` : ""}, your ${cap(type)} request was received.`
      : `New ${cap(type)} request submitted.`;
  try {
    return notificationTemplate(
      audience,
      message,
      {
        type,
        name: user?.name,
        email: user?.email,
        id,
        ...safePayload,
      } as any
    );
  } catch {
    return `<div style="font-family:Arial,sans-serif;padding:16px">
      <h3 style="margin:0 0 8px">${message}</h3>
      ${id ? `<p>Reference ID: <b>${id}</b></p>` : ""}
    </div>`;
  }
};

export async function notifyRequestSubmitted({
  type,
  user,
  payload = {},
  id,
  adminEmail = process.env.ADMIN_EMAIL,
}: NotifyArgs) {
  const safePayload = sanitizePayload(payload);

  console.log("Sending email notification with payload:", {
    type,
    user,
    payload: safePayload, // userName removed
    id,
  });

  const userHtml = buildTemplate("user", { type, user, payload: safePayload, id });
  const adminHtml = buildTemplate("admin", { type, user, payload: safePayload, id });

  const userEmail = user?.email?.trim();
  const adminTo = adminEmail?.trim();
  const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

  const tasks: Promise<any>[] = [];
  if (userEmail) tasks.push(sendEmail(userEmail, `Ziksir ${cap(type)} request received`, userHtml).catch(console.error));
  if (adminTo) tasks.push(sendEmail(adminTo, `New ${cap(type)} request`, adminHtml).catch(console.error));
  await Promise.allSettled(tasks);
}

export default notifyRequestSubmitted;
