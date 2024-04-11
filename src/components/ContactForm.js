import { useState } from "react";
import emailjs from "@emailjs/browser";

// TODO: convert to typescript
// TODO: sanitize user-input data
// TODO: add capta

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState(null);
  const sendEmail = (event) => {
    // TODO: what is this?
    event.persist();
    event.preventDefault();
    setIsSubmitting(true);

    emailjs
      .sendForm(
        // TODO: rename these to mention emailjs
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        event.target,
        { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY }
      )
      .then(
        (result) => {
          setStateMessage("Message sent!");
          setIsSubmitting(false);
          // Hide the message after 5 seconds
          setTimeout(() => {
            setStateMessage(null);
          }, 5000);
        },
        (error) => {
          setStateMessage("Something went wrong, please try again later");
          console.log("error = ", error);
          setIsSubmitting(false);
          // Hide the message after 5 seconds
          setTimeout(() => {
            setStateMessage(null);
          }, 5000);
        }
      );

    // Clears the form after sending the email
    event.target.reset();
  };

  /**
   * - send the word as `word`
   * - have a dropdown for the part of the entry that's wrong
   *   - word, definition, example sentence, synonyms
   *   - send that as `property`
   *  - have an input field to describe what's wrong
   *   - send that as `reason`
   */

  return (
    <form onSubmit={sendEmail}>
      {/* TODO: update to use fields relevant to this app, and then update the template in emailjs */}
      <label>Name</label>
      <input type="text" name="user_name" />
      <label>Email</label>
      <input type="email" name="user_email" />
      <label>Message</label>
      <textarea name="message" />
      {/* TODO: hitting enter key in form doesn't submit */}
      <input type="submit" value="Send" disabled={isSubmitting} />
      {stateMessage && <p>{stateMessage}</p>}
    </form>
  );
};
export default ContactForm;
