export const notificationTemplate = (
  title: string,
  message: string,
  details?: Record<string, string>
) => `
  <div style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #e0e7ff, #f5f7ff);
    padding: 30px 0;
  ">
    <div style="
      max-width: 550px;
      margin: auto;
      background: #ffffff;
      border-radius: 12px;
      padding: 30px 25px;
      box-shadow: 0 8px 20px rgba(76, 81, 191, 0.15);
    ">
      <h1 style="
        color: #4c51bf;
        text-align: center;
        font-size: 26px;
        margin-bottom: 10px;
      ">
        ziksir
      </h1>

      <h2 style="
        color: #2d3748;
        text-align: center;
        margin-bottom: 15px;
      ">
        ${title}
      </h2>

      <p style="color: #4a5568; font-size: 15px; margin-bottom: 20px;">
        ${message}
      </p>

      ${
        details
          ? `<div style="background: #f7fafc; border-radius: 8px; padding: 15px; font-size: 14px;">
              ${Object.entries(details)
                .map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`)
                .join("")}
            </div>`
          : ""
      }

      <p style="
        color: #a0aec0;
        font-size: 13px;
        margin-top: 25px;
        text-align: center;
      ">
        This is an automated message from Ziksir. Please do not reply.
      </p>
    </div>
  </div>
`;
