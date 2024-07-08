import { useMemo } from "react";
import css from "./styles.module.css";
import useContent from "hooks/useContent";
import BookCallButton from "components/BookCallButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

interface Props {
  sectionId: string;
}

interface SectionData {
  section: {
    heading: string;
    description: string;
  };
}

export default function Footer({ sectionId }: Props) {
  const query = useMemo(
    () =>
      `
  {
  section(id: "${sectionId}") {
    heading
    description
  }
}
  `,
    [sectionId]
  );

  const { data } = useContent<SectionData>(query, { isLazy: false });

  return (
    <footer className={css.container}>
      <div className={css.content}>
        <h2>{data?.section.heading}</h2>
        <p>{data?.section.description}</p>
        <BookCallButton hasHelperText={false} />
      </div>
      <ul className={css.socials}>
        <li>
          <a href="">
            <FontAwesomeIcon icon={faLinkedin} size="2x" />
          </a>
        </li>
        <li>
          <a href="">
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
        </li>
        <li>
          <a href="">
            <FontAwesomeIcon icon={faFacebook} size="2x" />
          </a>
        </li>
      </ul>
      <ul className={css.legalLinks}>
        <li>
          <a href={""}>Privacy Policy</a>
        </li>
        <li>
          <a href={""}>Terms & Conditions</a>
        </li>
      </ul>
    </footer>
  );
}
