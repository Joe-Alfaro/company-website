import { useMemo } from "react";
import useContent from "hooks/useContent";
import Errors from "components/Errors";
import css from "./styles.module.css";
import BookCallButton from "components/BookCallButton";

interface Props {
  sectionId: string;
}

interface Data {
  section: {
    heading: string;
    description: string;
    contentCollections: {
      items: Array<{ sys: { id: string } }>;
    };
  };
}
export default function Header({ sectionId }: Props): JSX.Element {
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

  const {
    data: section,
    isLoading,
    errors,
  } = useContent<Data, Data["section"]>(query, {
    onSuccess(data) {
      return data.section;
    },
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (errors.length) {
    return <Errors HeadingTag="h2" errors={errors} />;
  }

  return (
    <section className={css.container}>
      <div className={css.contentWrapper}>
        <a href="#" className={css.appStoreButton}>
          <img src="/appStore.svg" alt="Download on the Apple App Store" />
        </a>
        <div className={css.contentContainer}>
          <img className={css.tehlLogo} src="/tehlLogo.svg" alt="Tehl" />
          <h1 className={css.headerTitle}>{section?.heading}</h1>
          <p className={css.headerText}>{section?.description}</p>
          <BookCallButton />
        </div>
        <img
          className={css.backgroundLogo}
          src="/tehlBackgroundLogo.svg"
          alt="Tehl app homescreen"
          height={384}
        />
        <img
          className={css.screenGrab}
          src="/headerScreenGrab.png"
          alt="Tehl app homescreen"
          height={384}
        />
      </div>
    </section>
  );
}
