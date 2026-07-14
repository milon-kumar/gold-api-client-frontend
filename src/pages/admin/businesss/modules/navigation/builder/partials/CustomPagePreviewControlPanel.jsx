import HeroRenderer from "@/components/frontend/hero/HeroRenderer";
import SplitCardRenderer from "@/components/frontend/split-card/SplitCardRenderer";
import React, { useState, useMemo } from "react";

const CustomPagePreviewControlPanel = ({
  sections,
  selectedSectionId,
  selectedComponentId,
}) => {
  const selectedSection = useMemo(() => {
    return sections.find((section) => section.id === selectedSectionId) ?? null;
  }, [sections, selectedSectionId]);

  const selectedComponent = useMemo(() => {
    if (!selectedComponentId) return null;

    for (const section of sections) {
      const component = section.components?.find(
        (component) => component.id === selectedComponentId,
      );

      if (component) {
        return component;
      }
    }

    return null;
  }, [sections, selectedComponentId]);

  const ComponentRenderer = ({ component }) => {
    switch (component.type) {
      case "banner":
      case "carousel":
        return (
          <HeroRenderer
            sectionType={component.type}
            template={component.template}
            settings={component.settings}
          />
        );

      case "information":
        return <Information selectedComponent={component} />;

      case "list":
        return <List settings={component.settings} />;
      default:
        return null;
    }
  };

  return (
    <div className="">
      {sections
        .filter((section) => section.is_visible)
        .map((section) => (
          <div key={section.id}>
            {section.components
              ?.filter((component) => component.is_visible)
              .map((component) => (
                <ComponentRenderer key={component.id} component={component} />
              ))}
          </div>
        ))}
    </div>
  );
};

export default CustomPagePreviewControlPanel;

const Information = ({ selectedComponent }) => {
  const template = selectedComponent.template;
  const component = selectedComponent?.[template];

  if (!component) return null;

  const { content = {}, style = {} } = component;

  return (
    <SplitCardRenderer
      showSectionHeader={false}
      showFounder={true}
      imagePosition="left"
      sectionBgColor="bg-white"
      historyTitle={content.title}
      historyContent={content.fullDescription || content.shortDescription}
      image={{
        src: content.imageFullPath || content.image,
        alt: content.title,
      }}
      {...style}
    />
  );
};

const List = () => {
  return <div>List Preview</div>;
};
