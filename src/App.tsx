"use client";

import Section from "./components/Section";
import "./App.css";
import useContent from "./hooks/useContent";
import Errors from "./components/Errors";
import Path from "components/Path";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivacyPolicy from "components/staticPages/PrivacyPolicy";
import TermsConditions from "components/staticPages/TermsConditions";

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

  function HomePage() {
    return (
      <>
        <Path />
        {sectionIds?.map((id, index) => {
          const Component = Sections[index];

          if (Component) {
            return <Component sectionId={id} />;
          }

          return null;
        })}
      </>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/privacy-policy.html" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/terms-conditions.html" element={<TermsConditions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
