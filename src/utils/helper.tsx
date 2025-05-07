import { MailtrapClient } from "mailtrap"
/**
 * For this example to work, you need to set up a sending domain,
 * and obtain a token that is authorized to send from the domain.
 * @see https://help.mailtrap.io/article/69-sending-domain-setup
 */

const TOKEN = "76c720593f2d0e228d95e39efc6d957f";
const SENDER_EMAIL = "no-reply@bhawancare.com";

const client = new MailtrapClient({ token: TOKEN });

export const sendEmployeeCredentials = (
  recipientEmail:string,
  employeeID:string,
  password:string,
  fullName:string
) => {
  const subject = "🎉 Welcome to CPS Pvt Ltd - Your Employee Credentials";
  const htmlContent = `
    <!doctype html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      </head>
      <body style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <h1 style="color: #2e6c80;">🎉 Congratulations and Welcome to CPS Pvt Ltd!</h1>
          <p>We’re excited to have you on board. It’s a pleasure to welcome you to our team.</p>
          <p>Hi ${fullName} Below are your login credentials to access your employee dashboard:</p>
          <table style="margin-top: 20px; margin-bottom: 20px;">
            <tr>
              <td style="font-weight: bold; padding-right: 10px;">Employee ID:</td>
              <td>${employeeID}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding-right: 10px;">Password:</td>
              <td>${password}</td>
            </tr>
          </table>
          <p>
            You can access your employee dashboard here: <br />
            <a href="https://cpsteams.in/employee-portals" style="color: #007bff;">https://cpsteams.in/employee-portals</a>
          </p>
          <p>If you have any questions, feel free to reach out to the HR team.</p>
          <p>Wishing you great success and happiness at CPS Pvt Ltd!</p>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">This email was sent automatically. Please do not reply to this message.</p>
        </div>
      </body>
    </html>
    `;

  return client.send({
    category: "test",
    custom_variables: {
      hello: "world",
      year: 2022,
      anticipated: true,
    },
    from: { name: "CPS Pvt Ltd", email: SENDER_EMAIL },
    to: [{ email: recipientEmail }],
    subject,
    html: htmlContent,
  });
};
