export const resetLinkTemplate = (resetLink: string) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f0f4ff, #d9e2ff); padding: 15px 0; margin: 0;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 6px 18px rgba(100, 115, 255, 0.2); overflow: hidden;">
    <div style="background: linear-gradient(90deg, #667eea, #764ba2); padding: 18px 15px; text-align: center;">
      <h1 style="color: #f9f9f9; font-weight: 700; font-size: 26px; margin: 0; letter-spacing: 1.5px;">ziksir</h1>
    </div>
    <div style="padding: 20px 25px; color: #222; font-size: 16px; line-height: 1.4;">
      <h2 style="font-weight: 700; font-size: 21px; margin: 0 0 12px 0; color: #4c51bf;">Password Reset Request</h2>
      <p style="margin: 0 0 20px 0; color: #555;">We received a request to reset your password for your ziksir account. Click the button below to reset it. This link will be valid for <strong>15 minutes</strong>.</p>
      <div style="text-align: center; margin-bottom: 20px;">
        <a href="${resetLink}" style="display: inline-block; background: linear-gradient(90deg, #667eea, #764ba2); color: white; padding: 12px 28px; border-radius: 7px; font-weight: 700; font-size: 17px; text-decoration: none;">Reset Password</a>
      </div>
      <p style="font-size: 13px; color: #777; text-align: center; margin: 0;">If you didn’t request this, you can safely ignore this email.</p>
    </div>
    <div style="background: #f5f7ff; padding: 12px 15px; text-align: center; font-size: 12px; color: #999;">
      &copy; ${new Date().getFullYear()} ziksir. All rights reserved.
    </div>
  </div>
</div>
`;
