import { useState } from "react";
import emailjs from "@emailjs/browser";

// TODO: convert to typescript
// TODO: sanitize user-input data
// TODO: add capta

const ContactForm = ({ word }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState(null);
  const sendEmail = (event) => {
    // TODO: what is this?
    event.persist();
    event.preventDefault();
    setIsSubmitting(true);

    emailjs
      .sendForm(
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
   * - hide word input field
   * - change property input to dropdown
   * - make submit button work on enter from within the form
   */

  console.log("word = ", word);

  return (
    <form onSubmit={sendEmail}>
      <legend>Please tell us what's wrong with this word entry, thanks!</legend>
      {/* TODO: make this visually hidden */}
      {/* This is just to be sent with the form, not for the user to change */}
      <input type="text" name="word" value={word} aria-hidden />
      {/* TODO: make this a dropdown */}
      <label htmlFor="property">
        What part of this entry should be fixed? (Word, definition, example
        sentence, synonyms)
      </label>
      <input id="property" type="text" name="property" />
      <label htmlFor="reason">What's wrong with it?</label>
      <textarea id="reason" type="text" name="reason" />
      {/* TODO: hitting enter key in form doesn't submit */}
      <input type="submit" value="Send" disabled={isSubmitting} />
      {stateMessage && <p>{stateMessage}</p>}
    </form>
  );
};
export default ContactForm;
