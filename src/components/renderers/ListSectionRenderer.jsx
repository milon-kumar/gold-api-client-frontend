import { getWords } from "@/lib/helper";
import SectionHeader from "./SectionHeaderVarients";
import { imageFitClass } from "@/lib/styleHelper";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { StaffCard } from "@/pages/frontend/all-staffs/AllStaffs";
import ListCardTempalte from "./ListCardTemplate";
/**
 * =====================================================================
 * LIST RENDERER (Section) — Template Registry Pattern
 * =====================================================================
 */
const colsClass = (columns) =>
  ({ 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" })[
  Number(columns)
  ] || "md:grid-cols-3";

const Header = ({ badge, title, subtitle }) => (
  <div className="mb-6 text-center">
    {badge && (
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
        {badge}
      </span>
    )}
    {title && (
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
    )}
    {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
  </div>
);

const Empty = ({ label }) => (
  <p className="rounded border border-dashed p-6 text-center text-xs text-muted-foreground">
    Add {label} from the property panel →
  </p>
);


const ListView = ({ content, settings, styles }) => {
  const navigate = useNavigate();
  const handelDetails = (item) => {
    navigate(`/details/${item?._sourceId}`);
  };

  const moduleType = content?.items?.[0]?._moduleType || 'list';

  return (
    <div className="">
      {content.title && (
        <SectionHeader
          variant={settings?.sectionHeader || "classic"}
          badge={content.badge}
          title={content.title}
          subtitle={content.subtitle}
        />
      )}

      {content.items?.length ? (
        <div className="flex flex-col gap-3">
          {content.items.map((item, i) => {
            const data = item.item || item;
            const isReversed = i % 2 === 1;
            const imgSize = styles?.cardImageWidth || 120;

            if (moduleType === 'user') {
              return (
                <div
                  key={item._id || i}
                  className={cn(
                    "group flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-md",
                    isReversed ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {data.avatar_full_path && (
                    <div
                      style={{ width: imgSize, height: imgSize }}
                      className="shrink-0"
                    >
                      <img
                        src={data.avatar_full_path}
                        alt={data.name}
                        className={cn(
                          "h-full w-full transition-transform duration-300 group-hover:scale-105",
                          imageFitClass[styles?.imageFit] ?? "object-cover"
                        )}
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-center px-4 py-2 min-w-0">
                    <h3 className="text-base font-semibold text-slate-900 truncate">
                      {data.name}
                    </h3>
                    {data.meta?.position && (
                      <p className="text-sm text-slate-500 truncate">
                        {data.meta.position}
                      </p>
                    )}
                    {data.email && (
                      <p className="text-xs text-slate-400 truncate">{data.email}</p>
                    )}
                  </div>
                </div>
              );
            }

            const cardContent = data.sub_title || data.sub_description || data.description;

            return (
              <div
                key={item._id || i}
                className={cn(
                  "group flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-md",
                  isReversed ? "flex-row-reverse" : "flex-row"
                )}
              >
                {data.image_full_path && (
                  <div
                    style={{ width: imgSize, height: imgSize }}
                    className="shrink-0"
                  >
                    <img
                      src={data.image_full_path}
                      alt={data.title}
                      className={cn(
                        "h-full w-full transition-transform duration-300 group-hover:scale-105",
                        imageFitClass[styles?.imageFit] ?? "object-cover"
                      )}
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center px-4 py-2 min-w-0">
                  <h3
                    className="text-base font-semibold text-slate-900 cursor-pointer truncate hover:text-primary"
                    onClick={() => handelDetails(item)}
                  >
                    {data.title}
                  </h3>
                  {cardContent && (
                    <p
                      className="mt-1 text-sm text-slate-500 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: getWords(cardContent, settings?.cardSubTitleWordLimit || 20),
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty label="items" />
      )}
    </div>
  );
};

const Timeline = ({ content }) => (
  <div className="">
    <Header title={content.title} />
    {content.items?.length ? (
      <div className="relative ml-3 space-y-6 border-l-2 border-slate-200 pl-6">
        {content.items.map((item, i) => (
          <div key={item._id || i} className="relative">
            <span className="absolute -left-7.75 top-1 h-3 w-3 rounded-full bg-slate-900" />
            <p className="text-xs font-semibold text-slate-400">{item.year}</p>
            <p className="text-sm font-medium text-slate-900">{item.title}</p>
            {item.description && (
              <p className="mt-1 text-xs text-slate-500">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    ) : (
      <Empty label="items" />
    )}
  </div>
);

const Gallery = ({ content, settings }) => (
  <div className="">
    <Header title={content.title} />
    {content.images?.length ? (
      <div className={`grid gap-3 ${colsClass(settings.columns)}`}>
        {content.images.map((img, i) => (
          <figure key={img._id || i} className="overflow-hidden rounded-md">
            {img.image ? (
              <img
                src={img.image}
                alt={img.caption || ""}
                className="h-40 w-full object-cover"
              />
            ) : (
              <div className="flex h-40 items-center justify-center bg-slate-100 text-xs text-slate-400">
                Image
              </div>
            )}
            {img.caption && (
              <figcaption className="mt-1 text-center text-[11px] text-slate-500">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    ) : (
      <Empty label="images" />
    )}
  </div>
);

const News = ({ content }) => (
  <div className="">
    <Header title={content.title} />
    {content.items?.length ? (
      <div className="grid gap-4 md:grid-cols-3">
        {content.items.map((item, i) => (
          <a
            key={item._id || i}
            href={item.link || "#"}
            onClick={(e) => e.preventDefault()}
            className="overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
          >
            {item.image && (
              <img
                src={item.image}
                alt=""
                className="h-32 w-full object-cover"
              />
            )}
            <div className="p-4">
              {item.date && (
                <p className="text-[11px] text-slate-400">{item.date}</p>
              )}
              <h3 className="mt-1 text-sm font-semibold text-slate-900">
                {item.title}
              </h3>
              {item.excerpt && (
                <p className="mt-1 text-xs text-slate-500">{item.excerpt}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    ) : (
      <Empty label="news items" />
    )}
  </div>
);

const TEMPLATES = {
  cardGrid: ListCardTempalte,
  listView: ListView,
  timeline: Timeline,
  gallery: Gallery,
  news: News,
};

const ListSectionRenderer = ({
  template,
  content = {},
  settings = {},
  styles = {},
}) => {

  console.log("List content - ", content)

  const Template = TEMPLATES[template];
  if (!Template) {
    return (
      <div className="rounded border border-dashed p-6 text-center text-xs text-muted-foreground">
        Missing list template: {template}
      </div>
    );
  }
  return (
    <div
      className="w-full bg-white py-12"
      style={{
        backgroundColor: styles?.sectionBG || undefined,
        color: styles?.sectionTextColor || undefined,
        paddingTop: `${styles?.sectionPaddingY ?? 0}px`,
        paddingBottom: `${styles?.sectionPaddingY ?? 0}px`,
        paddingLeft: `${styles?.paddingX ?? 0}px`,
        paddingRight: `${styles?.paddingX ?? 0}px`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <Template content={content} settings={settings} styles={styles} />
      </div>
    </div>
  );
};

export default ListSectionRenderer;
