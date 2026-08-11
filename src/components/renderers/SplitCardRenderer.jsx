/**
 * =====================================================================
 * INFORMATION RENDERER (SplitCard) — Template Registry Pattern
 * =====================================================================
 */
import { Link } from "react-router";
import { Button } from "../ui/button";
import Badge from "./SectionBadgeVarients";
import InformationSimpleTempalte from "./InformationSimpleTempalte";

const ImagePlaceholder = ({ className = "", style = {} }) => (
  <div
    className={`flex items-center justify-center rounded-md bg-slate-200 text-xs text-slate-400 ${className}`}
    style={style}
  >
    Image
  </div>
);

const Img = ({ src, className, style = {} }) =>
  src ? (
    <img
      src={src}
      alt=""
      className={className}
      style={style}
    />
  ) : (
    <ImagePlaceholder
      className={className}
      style={style}
    />
  );


const ModernInfo = ({ content, settings, styles }) => {
  return (
    <div className="grid gap-8 p-8 md:grid-cols-2 md:items-center">
      <div>
        {
          settings?.showBadge ? (
            <>{content.badge && (
              <Badge variant={settings?.sectionHeaderBadge || "soft"} styles={styles}>
                {" "}
                {content.badge}
              </Badge>
            )}
            </>
          ) : null
        }

        {
          content.title && (
            <h2
              className="mt-3 font-bold text-slate-900"
              style={{
                fontSize: `${styles?.headingFontSize}px`,
              }}
            >
              {content.title}
            </h2>
          )
        }

        {content.description && (
          <p
            className="mt-2 mb-2 text-slate-600"
            style={{
              fontSize: `${styles?.paragraphFontSize}px`,
            }}
          >
            {content.description}
          </p>
        )}

        {
          content.buttonText && content.buttonLink && (
            <Link to={content.buttonLink} className="mt-4">
              <Button>{content.buttonText}</Button>
            </Link>
          )
        }
        {console.log("What is the content - ", content)}
      </div>

      <Img
        src={content.image}
        className={`
        h-full
        w-full
        object-contain

    ${styles?.applyImageScaleOnHover
            ? "transition-transform duration-300 hover:scale-105"
            : ""}

    ${styles?.applyImageShadowEffect
            ? "shadow-sm hover:shadow-md"
            : ""}
  `}
        style={{
          borderRadius: `${styles?.imageRounded ?? 8}px`,
        }}
      />
    </div>
  )
};

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
          <p className="mt-3 text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: content.description }} />
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
  simple: InformationSimpleTempalte,
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
        <Template content={content} settings={settings} styles={styles} />
      </div>
    </div>
  );
};

export default SplitCardRenderer;
