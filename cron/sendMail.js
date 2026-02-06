import { configDotenv } from "dotenv";
configDotenv();
import sgMail from "@sendgrid/mail";
import { assessmentThankYouTemplate } from "./mail";
const key = process.env.SENDGRID_KEY;

// export const sendAssessmentThankYouMail = async ({
//   name,
//   email,
//   assessmentId,
// }) => {
//   const previewUrl = `https://knovia.velocify.in/assessment/preview/${assessmentId}`;

//   await transport.sendMail({
//     from: {
//       name: "Velocify Team",
//       address: "noreply@velocify.in",
//     },
//     to: {
//       name,
//       address: email,
//     },
//     subject: "Thank you for attempting your assessment 🎉",
//     text: `Thank you for attempting the assessment. Preview here: ${previewUrl}`,
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//         <p>Hi ${name},</p>

//         <p>
//           Thank you for attempting the assessment. We really appreciate the
//           time and effort you put in.
//         </p>

//         <p>
//           You can preview your assessment using the link below:
//         </p>

//         <p>
//           <a href="${previewUrl}"
//              style="background:#2563eb;color:#fff;padding:10px 16px;
//                     border-radius:6px;text-decoration:none;display:inline-block;">
//             Preview Assessment
//           </a>
//         </p>

//         <p>
//           If you have any questions, feel free to reach out to us.
//         </p>

//         <p>— Velocify Team</p>
//       </div>
//     `,
//   });
// };

sgMail.setApiKey(key);
// sgMail.setDataResidency('eu');
// uncomment the above line if you are sending mail using a regional EU subuser

export const sendAssessmentThankYouMail = async ({
  name,
  email,
  assessmentId,
}) => {
  const previewUrl = `https://knovia.velocify.in/assessment/preview/${assessmentId}`;

  const msg = {
    to: email,
    from: {
      name: "Velocify Team",
      email: "noreply@velocify.in", // MUST be verified in SendGrid
    },
    subject: "Thank you for attempting your assessment 🎉",
    text: `Thank you for attempting the assessment. Preview here: ${previewUrl}`,
    html: assessmentThankYouTemplate(name, previewUrl),
  };

  await sgMail.send(msg);
};
