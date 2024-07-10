import { useEffect, useMemo } from "react";
import useContent from "hooks/useContent";
import Errors from "components/Errors";
import css from "./styles.module.css";

interface Props {
  sectionId: string;
}

interface SectionData {
  section: Section;
}

interface Section {
  heading: string;
  description: string;
  contentCollection: {
    items: Array<{ sys: { id: string } }>;
  };
}

interface ContentData {
  contentCollection: {
    items: Array<{
      sys: { id: string };
      text: string;
    }>;
  };
}

type Content = Array<{
  id: string;
  text: string;
}>;

export default function Header({ sectionId }: Props): JSX.Element {
  const sectionQuery = useMemo(
    () =>
      `
  {
  section(id: "${sectionId}") {
    heading
    description
    contentCollection {
      items {
        sys {
          id
        }
      }
    }
  }
}
  `,
    [sectionId]
  );

  const {
    data: contentIds,
    isLoading,
    errors,
  } = useContent<SectionData, Array<string>>(sectionQuery, {
    onSuccess(data) {
      return data.section.contentCollection.items.map((item) => item.sys.id);
    },
  });

  const contentIdsString = contentIds?.length
    ? `["${contentIds?.join(`", "`)}"]`
    : null;
  const contentQuery = useMemo(() => {
    return `
{
  contentCollection(where: {sys: {id_in: ${contentIdsString} }}) {
    items {
      sys {
        id
      }
      text
    }
  }
}
  `;
  }, [contentIdsString]);

  const [fetchContent, { data: content }] = useContent<ContentData, Content>(
    contentQuery,
    {
      isLazy: true,
      onSuccess(data) {
        return data.contentCollection.items.map((item) => ({
          id: item.sys.id,
          text: item.text,
        }));
      },
    }
  );

  useEffect(() => {
    if (contentIdsString) {
      fetchContent();
    }
  }, [contentIdsString, fetchContent]);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (errors.length) {
    return <Errors HeadingTag="h2" errors={errors} />;
  }

  return (
    <section className={css.container}>
      <div className={css.tehlLogo}>
        <div className={css.leftHalf}>
          <img src="/tehlLogoLeft.png" />
          <p>{content?.[0].text}</p>
        </div>
        <div className={css.rightHalf}>
          <img src="/tehlLogoRight.png" />
          <p>{content?.[1].text}</p>
        </div>
      </div>
      <img className={`${css.stock} ${css.one}`} src="/stock1.png" />
      <img className={`${css.stock} ${css.two}`} src="/stock2.png" />
      <img className={`${css.stock} ${css.three}`} src="/stock3.png" />
      <img className={`${css.stock} ${css.four}`} src="/stock4.png" />
    </section>
  );
}
