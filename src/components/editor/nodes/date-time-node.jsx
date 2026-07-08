import * as React from "react";

import { DecoratorTextNode, applyFormatFromStyle, applyFormatToDom } from "@lexical/extension";
import { $getState, $isTextNode, $setState, buildImportMap, createState } from "lexical";

const DateTimeComponent = React.lazy(() => import("@/components/editor/editor-ui/date-time-component"));

const tagToFormat = {
  b: "bold",
  i: "italic",
  mark: "highlight",
  s: "strikethrough",
  u: "underline"
};

const getDateTimeText = (dateTime) => {
  if (dateTime === undefined) {
    return "";
  }
  const hours = dateTime?.getHours();
  const minutes = dateTime?.getMinutes();
  return (dateTime.toDateString() + (hours === 0 && minutes === 0 ? "" : ` ${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`));
};

function $convertDateTimeElement(domNode) {
  const dateTimeValue = domNode.getAttribute("data-lexical-datetime");
  if (dateTimeValue) {
    const node = $createDateTimeNode(new Date(Date.parse(dateTimeValue)));
    return {
      after: (childLexicalNodes) => {
        // exportDOM returns only one child text, so only the first node of the array is taken
        const firstChild = childLexicalNodes[0];
        if ($isTextNode(firstChild)) {
          node.setFormat(firstChild.getFormat());
        }
        return childLexicalNodes;
      },
      node,
    };
  }
  const gDocsDateTimePayload = domNode.getAttribute("data-rich-links");
  if (!gDocsDateTimePayload) {
    return null;
  }
  const parsed = JSON.parse(gDocsDateTimePayload);
  const parsedDate =
    parsed?.dat_df?.dfie_ts?.tv?.tv_s * 1000 ||
    Date.parse(parsed?.dat_df?.dfie_dt || "");
  if (isNaN(parsedDate)) {
    return null;
  }
  const dateTimeNode = $createDateTimeNode(new Date(parsedDate));
  return { node: applyFormatFromStyle(dateTimeNode, domNode.style) };
}

const dateTimeState = createState("dateTime", {
  parse: (v) => new Date(v),
  unparse: (v) => v.toISOString(),
});

export class DateTimeNode extends DecoratorTextNode {
  $config() {
    return this.config("datetime", {
      extends: DecoratorTextNode,
      importDOM: buildImportMap({
        span: (domNode) =>
          domNode.getAttribute("data-lexical-datetime") !== null ||
          // GDocs Support
          (domNode.getAttribute("data-rich-links") !== null &&
            JSON.parse(domNode.getAttribute("data-rich-links") || "{}").type ===
              "date")
            ? {
                conversion: $convertDateTimeElement,
                priority: 2,
              }
            : null,
      }),
      stateConfigs: [{ flat: true, stateConfig: dateTimeState }],
    });
  }

  getDateTime() {
    return $getState(this, dateTimeState);
  }

  setDateTime(valueOrUpdater) {
    return $setState(this, dateTimeState, valueOrUpdater);
  }

  getTextContent() {
    const dateTime = this.getDateTime();
    return getDateTimeText(dateTime);
  }

  exportDOM() {
    const element = document.createElement("span");
    const textDom = document.createTextNode(getDateTimeText(this.getDateTime()));
    element.setAttribute("data-lexical-datetime", this.getDateTime()?.toString() || "");
    element.appendChild(applyFormatToDom(this, textDom, tagToFormat));

    return { element };
  }

  createDOM() {
    const element = document.createElement("span");
    element.setAttribute("data-lexical-datetime", this.getDateTime()?.toString() || "");
    element.style.display = "inline-block";
    return element;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return (
      <DateTimeComponent
        dateTime={this.getDateTime()}
        format={this.getFormat()}
        nodeKey={this.__key} />
    );
  }
}

export function $createDateTimeNode(dateTime) {
  return new DateTimeNode().setDateTime(dateTime);
}

export function $isDateTimeNode(node) {
  return node instanceof DateTimeNode;
}
