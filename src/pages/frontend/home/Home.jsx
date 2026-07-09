import HeroSection from "@/components/frontend/hero/HeroRenderer"
import BannerRenderer from "@/components/frontend/banner/BannerRenderer"
import ImageGroupRenderer from "@/components/frontend/image-group/ImageGroupRenderer"
import SplitCardRenderer from "@/components/frontend/split-card/SplitCardRenderer"
import CardRenderer from "@/components/frontend/card/CardRenderer"
import { sampleImages } from "@/store/default/component-placeholder"

import Programs from "./partial/Programs"
import Committee from "./partial/Committee"

import { useApiQuery } from "@/hooks/useAppQuery"
import { asset } from "@/lib/helper"
import Publications from "./partial/Publication"
import Projects from "./partial/Projects"
import MonthlyMeeting from "./partial/MonthlyMeeting"
import { MODULES } from "@/store/default/modules"
import Section from "@/components/partials/frontend/Section"
import Video from "./partial/Video"
import Image from "./partial/Image"

export default function Home() {

    const { data, isLoading, error } = useApiQuery({
        url: '/home',
        queryKey: ['home']
    });
    const {
        data: sliderItemQuery,
        isLoading: sliderItemLoading,
        error: sliderItemError
    } = useApiQuery({
        url: '/module-items',
        queryKey: [MODULES.SLIDERS],
        params: {
            module_slug: MODULES.SLIDERS,
            limit: 9
        }
    });

    const sliderItems = sliderItemQuery?.data;

    const {
        data: moduleQuery,
        isLoading: isModuleLoading,
        error: moduleError
    } = useApiQuery({
        url: '/module',
        queryKey: [MODULES.PRESIDENT_MESSAGE],
        params: {
            module_slug: MODULES.PRESIDENT_MESSAGE
        }
    });

    const presidentMessage = moduleQuery?.data;


    const {
        data: introductionQuery,
        isLoading: introductionModuleLoading,
        error: introductionModuleError
    } = useApiQuery({
        url: '/module',
        queryKey: [MODULES.INTRODUCTION],
        params: {
            module_slug: MODULES.INTRODUCTION
        }
    });

    const introductionContent = introductionQuery?.data;

    const {
        data: whatWeWantQuery,
        isLoading: whatWeWantModuleLoading,
        error: whatWeWantModuleError
    } = useApiQuery({
        url: '/module',
        queryKey: [MODULES.WHAT_WE_WANT],
        params: {
            module_slug: MODULES.WHAT_WE_WANT
        }
    });

    const whatWeWantContent = whatWeWantQuery?.data;

    const {
        data: foundingPresidentQuery,
        isLoading: foundingPresidentModuleLoading,
        error: foundingPresidentModuleError
    } = useApiQuery({
        url: '/module',
        queryKey: [MODULES.FOUNDING_PRESIDENT],
        params: {
            module_slug: MODULES.FOUNDING_PRESIDENT
        }
    });

    const foundingPresidentContent = foundingPresidentQuery?.data;

    const {
        data: staffItemQuery,
        isLoading: staffItemLoading,
        error: staffItemError
    } = useApiQuery({
        url: '/staffs',
        queryKey: ['staffs'],
        params: {
            limit: 6
        }
    });

    const staffItems = staffItemQuery?.data;

    const {
        data: organizationItemQuery,
        isLoading: organizationItemLoading,
        error: organizationItemError
    } = useApiQuery({
        url: '/module-items',
        queryKey: [MODULES.ORGANIZATIONS],
        params: {
            module_slug: MODULES.ORGANIZATIONS,
            limit: 3
        }
    });

    const organizationItems = organizationItemQuery?.data;

    const {
        data: videoItemQuery,
        isLoading: videoItemLoading,
        error: videoItemError
    } = useApiQuery({
        url: '/module-items',
        queryKey: [MODULES.VIDEOS],
        params: {
            module_slug: MODULES.VIDEOS,
            limit: 6
        }
    });

    const videoItems = videoItemQuery?.data;


    const {
        data: imageItemQuery,
        isLoading: imageItemLoading,
        error: imageItemError
    } = useApiQuery({
        url: '/module-items',
        queryKey: [MODULES.PHOTOS],
        params: {
            module_slug: MODULES.PHOTOS,
            limit: 9
        }
    });

    const imageItems = imageItemQuery?.data;

    const {
        data: archiveItemQuery,
        isLoading: archiveItemLoading,
        error: archiveItemError
    } = useApiQuery({
        url: '/module-items',
        queryKey: [MODULES.ARCHIVES],
        params: {
            module_slug: MODULES.PHOTOS,
            limit: 9
        }
    });

    const archiveItems = archiveItemQuery?.data;



    const {
        data: anualPlanItemQuery,
        isLoading: anualPlanItemLoading,
        error: anualPlanItemError
    } = useApiQuery({
        url: '/module-items',
        queryKey: [MODULES.ANNUAL_PLANS],
        params: {
            module_slug: MODULES.ANNUAL_PLANS,
            limit: 9
        }
    });

    const anualPlanItems = anualPlanItemQuery?.data;

    const {
        data: regularActivitiesItemQuery,
        isLoading: regularActivitiesItemLoading,
        error: regularActivitiesItemError
    } = useApiQuery({
        url: '/module-items',
        queryKey: [MODULES.REGULAR_ACTIVITIES],
        params: {
            module_slug: MODULES.REGULAR_ACTIVITIES,
            limit: 9
        }
    });

    const regularActivitiesItems = regularActivitiesItemQuery?.data;


    const {
        data: socialActivitiesItemQuery,
        isLoading: socialActivitiesItemLoading,
        error: socialActivitiesItemError
    } = useApiQuery({
        url: '/module-items',
        queryKey: [MODULES.SOCIAL_ACTIVITIES],
        params: {
            module_slug: MODULES.SOCIAL_ACTIVITIES,
            limit: 9
        }
    });

    const socialActivitiesItems = socialActivitiesItemQuery?.data;

    console.log("video image - ", {
        videoItems,
        imageItems
    })

    const { data: settingsResponse } = useApiQuery({
        url: 'settings',
    })

    const slides = data?.data?.sliders || [];
    const statistics = data?.data?.statistics || [];
    const webSettings = settingsResponse?.data?.data || [];
    const webNotices = data?.data?.web_notices || [];
    const staffs = data?.data?.staffs || [];
    const featuredNews = data?.data?.featured_news || [];
    const program_list = data?.data?.program_list || [];
    const books = data?.data?.books || [];

    const sliders = slides && slides?.length ? slides : sampleImages;

    return (
        <>
            {
                sliders && (
                    <HeroSection sectionType="carousel" template="simpleImageSlider"
                        sliders={sliderItems}
                        statistics={statistics}
                        webNotices={webNotices}
                        webSettings={webSettings}
                        staffs={staffs}
                    />
                )
            }

            {/* <ImageGroupRenderer template="simple" images={sampleImages} columns={4} imageSize="lg" rounded={'full'} gap={'xs'} /> */}

            {
                presidentMessage && (
                    <SplitCardRenderer
                        template="simple"
                        imagePosition="right"
                        showSectionHeader={false}
                        showFounder={false}
                        infoCards={[]}
                        historyTitle={presidentMessage?.title}
                        historyContent={presidentMessage?.short_description}
                        image={{
                            src: presidentMessage?.image_full_path
                        }}
                    />
                )
            }

            {
                introductionContent && (
                    <SplitCardRenderer
                        template="simple"
                        imagePosition="left"
                        showSectionHeader={false}
                        showFounder={false}
                        infoCards={[]}
                        historyTitle={introductionContent?.title}
                        historyContent={introductionContent?.short_description}
                        image={{
                            src: introductionContent?.image_full_path
                        }}
                        sectionBgColor="bg-white"
                    />

                )
            }


            {
                whatWeWantContent && (
                    <SplitCardRenderer
                        template="simple"
                        imagePosition="right"
                        showSectionHeader={false}
                        showFounder={false}
                        infoCards={[]}
                        historyTitle={whatWeWantContent?.title}
                        historyContent={whatWeWantContent?.short_description}
                        image={{
                            src: whatWeWantContent?.image_full_path
                        }}
                    />
                )
            }

            {
                foundingPresidentContent && (
                    <SplitCardRenderer
                        template="simple"
                        imagePosition="left"
                        showSectionHeader={false}
                        showFounder={false}
                        infoCards={[]}
                        historyTitle={foundingPresidentContent?.title}
                        historyContent={foundingPresidentContent?.short_description}
                        image={{
                            src: foundingPresidentContent?.image_full_path
                        }}
                        sectionBgColor="bg-white"
                    />
                )
            }

            {
                organizationItems?.length > 0 && (() => {
                    const items = organizationItems.map((item) => {
                        return {
                            id: item?.id,
                            title: item?.title,
                            subTitle: item?.sub_description,
                            imageUrl: item?.image_full_path,
                            link: `/organization/${item?.id}`,
                            buttonText: "Details",
                        }
                    });

                    return (
                        <Section
                            badge={'চলমান কর্মসূচী'}
                            title={'চলমান কর্মসূচী'}
                            align="left"
                            items={items}
                        />
                    );
                })()
            }

            {
                staffItems && staffItems?.length > 0 && (() => {
                    const items = staffItems?.map((item) => {
                        console.log("staff - ", item)
                        return {
                            name: item?.name,
                            email: item?.email,
                            phone: item?.phone,
                            jobType: "প্রকাশনা সম্পাদক",
                            photo: item?.avatar_full_path
                        }
                    })

                    return (
                        <Committee
                            badge={'কেন্দ্রীয় কর্মপরিষদ'}
                            title={'কেন্দ্রীয় কর্মপরিষদ'}
                            align="left"
                            items={items}
                        />
                    )
                })()
            }
            {
                imageItems && (
                    <Image items={imageItems} />
                )
            }

            {
                videoItems && (
                    <Video items={videoItems} />
                )
            }



            {
                featuredNews && featuredNews?.length > 0 && (
                    <Programs webSettings={webSettings} items={featuredNews} />
                )
            }

            {
                archiveItems?.length > 0 && (() => {
                    const items = archiveItems?.map((item) => {
                        return {
                            id: item?.id,
                            title: item?.title,
                            subTitle: item?.sub_description,
                            imageUrl: item?.image_full_path,
                            link: `/archives/${item?.id}`,
                            buttonText: "Details",
                        }
                    });

                    return (
                        <Section
                            badge={'আর্কাইভ'}
                            title={'আর্কাইভ'}
                            align="left"
                            items={items}
                        />
                    );
                })()
            }



            {
                anualPlanItems?.length > 0 && (() => {
                    const items = archiveItems?.map((item) => {
                        return {
                            id: item?.id,
                            title: item?.title,
                            subTitle: item?.sub_description,
                            imageUrl: item?.image_full_path,
                            link: `/archives/${item?.id}`,
                            buttonText: "Details",
                        }
                    });

                    return (
                        <Section
                            badge={'বাৎসরিক পরিকল্পনা'}
                            title={'বাৎসরিক পরিকল্পনা'}
                            align="left"
                            items={items}
                        />
                    );
                })()
            }


            {
                regularActivitiesItems?.length > 0 && (() => {
                    const items = regularActivitiesItems.map((item) => {
                        return {
                            id: item?.id,
                            title: item?.title,
                            subTitle: item?.sub_description,
                            imageUrl: item?.image_full_path,
                            link: `/archives/${item?.id}`,
                            buttonText: "Details",
                        }
                    });

                    return (
                        <Section
                            badge={'নিয়মিত কার্যক্রম'}
                            title={'নিয়মিত কার্যক্রম'}
                            align="left"
                            items={items}
                        />
                    );
                })()
            }

            {
                socialActivitiesItems?.length > 0 && (() => {
                    const items = socialActivitiesItems.map((item) => {
                        return {
                            id: item?.id,
                            title: item?.title,
                            subTitle: item?.sub_description,
                            imageUrl: item?.image_full_path,
                            link: `/archives/${item?.id}`,
                            buttonText: "Details",
                        }
                    });

                    return (
                        <Section
                            badge={'সামাজিক কার্যক্রম '}
                            title={'সামাজিক কার্যক্রম '}
                            align="left"
                            items={items}
                        />
                    );
                })()
            }

            {/* <Publications webSettings={webSettings} /> */}
            {/* <Projects webSettings={webSettings} items={program_list} />
            <MonthlyMeeting books={books} /> */}
        </>
    )
}   