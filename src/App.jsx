import { useEffect, useMemo, useState } from "react";
import { Layout } from "./components/Layout.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { CategoryPage } from "./pages/CategoryPage.jsx";
import { AdminDownloadsPage } from "./pages/AdminDownloadsPage.jsx";
import { AdminTargetLinksPage } from "./pages/AdminTargetLinksPage.jsx";
import { ManagerPage } from "./pages/ManagerPage.jsx";
import { getPageFromHash } from "./utils/navigation.js";
import { pageResources } from "./data/config.js";

function App() {
  const [currentPage, setCurrentPage] = useState(getPageFromHash());

  useEffect(() => {
    const handleHashChange = () => setCurrentPage(getPageFromHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const activeCategory = useMemo(() => pageResources[currentPage], [currentPage]);

  return (
    <Layout currentPage={currentPage}>
      {currentPage === "manager" ? (
        <ManagerPage />
      ) : currentPage === "admin/downloads" ? (
        <AdminDownloadsPage />
      ) : currentPage === "admin/links" ? (
        <AdminTargetLinksPage />
      ) : activeCategory ? (
        <CategoryPage pageId={currentPage} page={activeCategory} />
      ) : (
        <DashboardPage />
      )}
    </Layout>
  );
}

export default App;
