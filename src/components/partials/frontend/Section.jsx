import SectionHeader from '@/components/partials/frontend/SectionHeader';

import SectionCard from './SectionCard';

const Section = ({ badge, title, subTitle, align = "center", items = [] }) => {
    return (
        <section id="publications" className="py-5 sm:py-5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <SectionHeader badge={badge} title={title} subtitle={subTitle} align={align} />

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    {(items)?.map((item) => (
                        <SectionCard key={item.id} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Section