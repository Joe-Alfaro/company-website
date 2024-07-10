import { useCallback, useEffect, useMemo, useState } from "react";
import useContent from "hooks/useContent";
import Errors from "components/Errors";
import css from "./styles.module.css";
import BookCallButton from "components/BookCallButton";
import cn from "classnames";

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
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = useCallback(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth >= 1120);
    }
  }, []);

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

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

  function Heading() {
    if (!section?.heading) {
      return null;
    }

    const description = section.heading.replace(
      "love you.",
      "<span>love you.</span>"
    );

    return (
      <h1
        className={css.headerTitle}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  }

  return (
    <section className={cn({ [css.container]: true, [css.mobile]: isMobile })}>
      <div className={css.contentWrapper}>
        <div className={css.contentContainer}>
          <img className={css.tehlLogo} src="/tehlLogo.svg" alt="Tehl" />
          <Heading />
          <p className={css.headerText}>{section?.description}</p>
          <BookCallButton />
        </div>
        <a href="#" className={css.appStoreButton}>
          <img src="/appStore.svg" alt="Download on the Apple App Store" />
        </a>
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
