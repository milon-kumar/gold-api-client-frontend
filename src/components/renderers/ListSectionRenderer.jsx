import { getWords } from "@/lib/helper";
import SectionHeader from "./SectionHeaderVarients";
import { imageFitClass } from "@/lib/styleHelper";
import { cn } from "@/lib/utils";
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

const CardGrid = ({ content, settings, styles }) => {
  return (
    <div className="">
      <SectionHeader
        variant={settings?.sectionHeader || "classic"}
        badge={content.badge}
        title={content.title}
        subtitle={content.subtitle}
      />
      {content.items?.length ? (
        <div className={`grid gap-4 ${colsClass(settings.columns)}`}>
          {content.items.map((item, i) => {
            const cardContent =
              item.sub_title || item.sub_description || item.description;
            return (
              <div
                key={item._id || i}
                className="overflow-hidden rounded-lg border"
              >
                {item.image && (
                  <div
                    style={{ height: styles.cardImageHeight || 200 }}
                    className="bject-contain"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className={cn(
                        "h-full w-full",
                        imageFitClass[styles?.imageFit] ?? "object-cover",
                      )}
                    />
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  {cardContent && (
                    <p
                      className="mt-1 text-base text-slate-500"
                      dangerouslySetInnerHTML={{
                        __html: getWords(
                          cardContent,
                          settings?.cardSubTitleWordLimit || 50,
                        ),
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

const ListView = ({ content }) => (
  <div className="">
    <Header title={content.title} />
    {content.items?.length ? (
      <ul className="space-y-3">
        {content.items.map((item, i) => (
          <li key={item._id || i} className="rounded-md border p-4">
            <p className="text-sm font-medium text-slate-900">{item.title}</p>
            {item.description && (
              <p className="mt-1 text-xs text-slate-500">{item.description}</p>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <Empty label="items" />
    )}
  </div>
);

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
  cardGrid: CardGrid,
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
