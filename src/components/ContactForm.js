import { useState } from "react";
import emailjs from "@emailjs/browser";
import styles from "@/styles/ContactForm.module.css";

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
          // Clears the form after sending the email
          event.target.reset();
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
  };

  /**
   * - change property input to dropdown
   * - make submit button work on enter from within the form
   */

  return (
    <form onSubmit={sendEmail} className={styles.form}>
      <legend>
        <h2 className={styles.heading}>
          Please tell us what's wrong with this word entry, thanks!
        </h2>
      </legend>

      {/* This is just to be sent with the form, not for the user to change */}
      <input
        type="text"
        name="word"
        value={word}
        aria-hidden
        readOnly
        className={styles.wordInput}
      />

      <div className={styles.inputFields}>
        <div>
          {/* TODO: make this a dropdown */}
          <label htmlFor="property" className={styles.label}>
            What part of this entry should be fixed? (Word, definition, example
            sentence, synonyms)
          </label>
          <input
            id="property"
            type="text"
            name="property"
            className={styles.input}
          />
        </div>
        <div>
          <label className={styles.label} htmlFor="reason">
            What's wrong with it?
          </label>
          <textarea
            id="reason"
            type="text"
            name="reason"
            className={styles.textarea}
          />
        </div>
      </div>

      {/* TODO: hitting enter key in form doesn't submit */}
      <button type="submit" disabled={isSubmitting} className={styles.submit}>
        Submit
      </button>
      {stateMessage && <p>{stateMessage}</p>}
    </form>
  );
};
export default ContactForm;
