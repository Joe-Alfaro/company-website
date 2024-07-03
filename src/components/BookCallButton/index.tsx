import css from "./styles.module.css";

export default function BookCallButton() {
  return (
    <>
      <a
        className={css.button}
        aria-describedby="book-a-call-helper"
        href="https://calendly.com/tehlmeeting/30min"
        target="_blank"
        rel="noopener noreferrer"
      >
        Book a Call
      </a>
      <span className={css.helperText} id="book-a-call-helper">
        To get your business on Tehl
      </span>
    </>
  );
}
