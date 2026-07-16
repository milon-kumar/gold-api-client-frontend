import FrontendSectionRenderer from "@/components/renderers/FrontendSectionRender";
import Loading from "@/components/shear/Loading";
import { useApiQuery } from "@/hooks/useAppQuery";
import { safeJsonParse } from "@/lib/helper";
import { useOutletContext } from "react-router";
import StaticHome from "./StaticHomePage";

const Home = () => {
  const { settings } = useOutletContext();

  const settingMeta = safeJsonParse(settings?.meta);

  const { data: page, isLoading: pageLoading } = useApiQuery({
    url: `/page-by-id/${settingMeta?.home_page_id}`,
    enabled: !!settingMeta?.home_page_id,
  });

  const pageConfig = safeJsonParse(page?.data?.meta);
  const sections = safeJsonParse(pageConfig?.page_config) || [];

  if (pageLoading) {
    return <Loading />;
  }


  if ((!settingMeta?.home_page_id) || !sections) {
    return <StaticHome />;
  }

    if (sections) {
    return <FrontendSectionRenderer sections={sections} />;
  }
};

export default Home;


