import { getRenderer } from "@/components/renderers";
import { getComponentConfig } from "@/store/default/componentRegistry";

const FrontendSectionRenderer = ({ sections }) => {
  const visibleSections = sections?.filter((s) => s.is_visible);

  return (
    <div>
      {visibleSections.map((section) => (
        <div
          key={section.id}
          className={``}
        >
          {section.components
            .filter((c) => c.is_visible)
            .map((component) => {
              const config = getComponentConfig(component.component);
              const Renderer = getRenderer(config?.renderer);

              return (
                <div
                  key={component.id}
                  className={``}
                >
                  {Renderer ? (
                    <Renderer
                      type={component.type}
                      template={component.template}
                      content={component.content}
                      settings={component.settings}
                      styles={component.styles}
                    />
                  ) : null}
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
};

export default FrontendSectionRenderer;