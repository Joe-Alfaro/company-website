import Section from "./components/Section";
import "./App.css";
import useContent from "./hooks/useContent";
import Errors from "./components/Errors";

const query = `
{
  page(id:"H3BMy053lo9yFwBThuqNa"){
    sys {
      id
    }
    sectionsCollection {
      items{
        sys{
          id
        }
      }
    }
  }
}
`;
interface Data {
  page: {
    sectionsCollection: { items: { sys: { id: string } }[] };
  };
}
function App() {
  const {
    data: sectionIds,
    isLoading,
    errors,
  } = useContent<Data, string[]>(query, {
    onSuccess(data) {
      return data.page.sectionsCollection.items.map((item) => item.sys.id);
    },
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (errors.length) {
    return <Errors errors={errors} />;
  }

  if (!sectionIds?.length) {
    return <h1>No content to show right now</h1>;
  }

  const Sections = [
    Section.Header,
    Section.TehlLogo,
    Section.Steps,
    Section.Benefits,
    Section.Footer,
  ] as const;

  return (
    <>
      {sectionIds.map((id, index) => {
        const Component = Sections[index];

        if (Component) {
          return <Component sectionId={id} />;
        }

        return null;
      })}
    </>
  );
}

export default App;
