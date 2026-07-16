/**
 * =====================================================================
 * INFORMATION RENDERER (SplitCard) — Template Registry Pattern
 * =====================================================================
 */
import Badge from "./SectionBadgeVarients";

const ImagePlaceholder = ({ className = "" }) => (
  <div
    className={`flex items-center justify-center rounded-md bg-slate-200 text-xs text-slate-400 ${className}`}
  >
    Image
  </div>
);

const Img = ({ src, className }) =>
  src ? (
    <img src={src} alt="" className={className} />
  ) : (
    <ImagePlaceholder className={className} />
  );

const SimpleInfo = ({ content }) => (
  <div className="rounded-lg border bg-white p-8 text-center">
    <h2 className="text-2xl font-semibold text-slate-900">{content.title}</h2>
    {content.description && (
      <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
        {content.description}
      </p>
    )}
    <Img
      src={content.image}
      className="mx-auto mt-6 h-48 w-full max-w-xl rounded-md object-cover"
    />
  </div>
);

const ModernInfo = ({ content, settings }) => (
  <div className="grid gap-8 p-8 md:grid-cols-2 md:items-center">
    <div>
      {content.badge && (
        <Badge variant={settings?.sectionHeaderBadge || "soft"}>
          {" "}
          {content.badge}
        </Badge>
      )}

      <h2 className="mt-3 text-3xl font-bold text-slate-900">
        {content.title}
      </h2>
      {content.description && (
        <p className="mt-3 text-sm text-slate-600">{content.description}</p>
      )}
    </div>
    <Img src={content.image} className="h-64 w-full rounded-lg object-contain" />
  </div>
);

const FounderInfo = ({ content }) => (
  <div className="flex flex-col items-center gap-4 rounded-lg border bg-white p-8 text-center md:flex-row md:text-left">
    <Img
      src={content.founderImage}
      className="h-28 w-28 shrink-0 rounded-full object-cover"
    />
    <div>
      {content.message && (
        <p className="text-sm italic text-slate-600">“{content.message}”</p>
      )}
      <p className="mt-3 font-semibold text-slate-900">{content.founderName}</p>
      {content.designation && (
        <p className="text-xs text-slate-500">{content.designation}</p>
      )}
    </div>
  </div>
);

const SideBySide = (imageFirst) => {
  const Cmp = ({ content }) => (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      {imageFirst && (
        <Img
          src={content.image}
          className="h-64 w-full rounded-lg object-contain"
        />
      )}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          {content.title}
        </h2>
        {content.description && (
          <p className="mt-3 text-sm text-slate-600" dangerouslySetInnerHTML={{__html:content.description}}/>
        )}
        {content.buttonText && (
          <a
            href={content.buttonLink || "#"}
            onClick={(e) => e.preventDefault()}
            className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
          >
            {content.buttonText}
          </a>
        )}
      </div>
      {!imageFirst && (
        <Img
          src={content.image}
          className="h-64 w-full rounded-lg object-contain"
        />
      )}
    </div>
  );
  return Cmp;
};

const TEMPLATES = {
  simple: SimpleInfo,
  modern: ModernInfo,
  founder: FounderInfo,
  imageLeft: SideBySide(true),
  imageRight: SideBySide(false),
};

const SplitCardRenderer = ({
  template,
  content = {},
  settings = {},
  styles = {},
}) => {
  const Template = TEMPLATES[template];
  if (!Template) {
    return (
      <div className="rounded border border-dashed p-6 text-center text-xs text-muted-foreground">
        Missing information template: {template}
      </div>
    );
  }
  return (
    <div
      className="w-full"
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
        <Template content={content} settings={settings} />
      </div>
    </div>
  );
};

export default SplitCardRenderer;
