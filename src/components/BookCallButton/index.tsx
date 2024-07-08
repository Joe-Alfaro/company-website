import { ComponentPropsWithoutRef } from "react";
import cn from "classnames";
import css from "./styles.module.css";

interface Props {
  linkClassName?: string;
  helperTextClassName?: string;
  hasHelperText?: boolean;
}

export default function BookCallButton({
  linkClassName,
  hasHelperText = true,
}: Props) {
  const linkProps: ComponentPropsWithoutRef<"a"> = {
    className: cn([css.button, linkClassName]),
    href: "https://calendly.com/tehlmeeting/30min",
    target: "_blank",
    rel: "noopener noreferrer",
  };

  if (hasHelperText) {
    linkProps["aria-describedby"] = "book-a-call-helper";
  }

  return (
    <>
      <a {...linkProps}>Book a Call</a>
      {hasHelperText ? (
        <span className={css.helperText} id="book-a-call-helper">
          To get your business on Tehl
        </span>
      ) : null}
    </>
  );
}
