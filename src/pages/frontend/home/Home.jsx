import FrontendSectionRenderer from "@/components/renderers/FrontendSectionRender";
import Loading from "@/components/shear/Loading";
import { useApiQuery } from "@/hooks/useAppQuery";
import { safeJsonParse } from "@/lib/helper";
import { useOutletContext } from "react-router";
import StaticHome from "./StaticHomePage";

const Home = () => {
  const { settings } = useOutletContext();

  const settingMeta = settings?.meta; //safeJsonParse();

  // console.log("What is the setting meta ",{
  //   settings,
  //   settingMeta
  // })

  const { data: page, isLoading: pageLoading } = useApiQuery({
    url: `/page-by-id/${settings?.home_page_id}`,
    enabled: !!settingMeta?.home_page_id,
  });

  const pageConfig = safeJsonParse(page?.data?.meta);
  console.log("What is the page - ", {
    pageConfig,
    pageMeta: page?.data?.meta,
  });
  const sections = settings?.home_page?.meta?.page_config || []; //safeJsonParse(pageConfig?.page_config) || [];

  console.log("|what is tyhe section - ", {
    settings,
    sections,
  });

  if (pageLoading) {
    return <Loading />;
  }

  // if (!settingMeta?.home_page_id || !sections) {
  //   return <StaticHome />;
  // }

  if (sections) {
    return <FrontendSectionRenderer sections={sections} />;
  }
};

export default Home;
