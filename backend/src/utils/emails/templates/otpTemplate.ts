export const otpTemplate = (otp: string) => `
<div style="
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #e0e7ff, #f5f7ff);
  padding: 30px 0;
">
  <div style="
    max-width: 500px;
    margin: auto;
    background: #ffffff;
    border-radius: 12px;
    padding: 30px 25px;
    box-shadow: 0 8px 20px rgba(76, 81, 191, 0.15);
    text-align: center;
  ">
    <!-- Logo / Brand -->
    <h1 style="
      color: #4c51bf;
      margin-bottom: 10px;
      font-size: 28px;
      letter-spacing: 1px;
    ">
      ziksir
    </h1>

    <!-- Title -->
    <h2 style="
      color: #2d3748;
      margin-bottom: 8px;
      font-size: 22px;
    ">
      Your One-Time Password
    </h2>

    <!-- Subtext -->
    <p style="
      color: #4a5568;
      font-size: 15px;
      margin-bottom: 20px;
    ">
      Please use the following OTP to complete your verification.  
      This code will expire in <strong>3 minutes</strong>.
    </p>

    <!-- OTP Box -->
    <div style="
      display: inline-block;
      background: linear-gradient(90deg, #667eea, #764ba2);
      color: white;
      font-size: 28px;
      font-weight: bold;
      letter-spacing: 8px;
      padding: 14px 28px;
      border-radius: 8px;
      margin: 15px 0 25px 0;
      box-shadow: 0 4px 14px rgba(118, 75, 162, 0.3);
    ">
      ${otp}
    </div>

    <!-- Footer Note -->
    <p style="
      color: #a0aec0;
      font-size: 13px;
      margin-top: 10px;
    ">
      If you didn’t request this, please ignore this email.
    </p>
  </div>
</div>
`;
