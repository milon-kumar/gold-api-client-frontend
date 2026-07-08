import * as React from "react";

import { $applyNodeReplacement, DecoratorNode } from "lexical";

const ImageComponent = React.lazy(() => import("../editor-ui/image-component"));

function isGoogleDocCheckboxImg(img) {
  return (img.parentElement != null &&
  img.parentElement.tagName === "LI" &&
  img.previousSibling === null && img.getAttribute("aria-roledescription") === "checkbox");
}

function $convertImageElement(domNode) {
  const img = domNode;
  const src = img.getAttribute("src");
  if (!src || src.startsWith("file:///") || isGoogleDocCheckboxImg(img)) {
    return null;
  }
  const { alt: altText, width, height } = img;
  const node = $createImageNode({ altText, height, src, width });
  return { node };
}

export class ImageNode extends DecoratorNode {
  static getType() {
    return "image";
  }

  static clone(node) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__key
    );
  }

  static importJSON(serializedNode) {
    const { altText, height, width, maxWidth, src } = serializedNode;
    return $createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width,
    }).updateFromJSON(serializedNode);
  }

  updateFromJSON(serializedNode) {
    const node = super.updateFromJSON(serializedNode);

    return node;
  }

  exportDOM() {
    const imgElement = document.createElement("img");
    imgElement.setAttribute("src", this.__src);
    imgElement.setAttribute("alt", this.__altText);
    imgElement.setAttribute("width", this.__width.toString());
    imgElement.setAttribute("height", this.__height.toString());

    return { element: imgElement };
  }

  static importDOM() {
    return {
      img: () => ({
        conversion: $convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src,
    altText,
    maxWidth,
    width,
    height,
    key,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      altText: this.getAltText(),
      height: this.__height === "inherit" ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      width: this.__width === "inherit" ? 0 : this.__width,
    };
  }

  setWidthAndHeight(width, height) {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
    return writable;
  }

  // View

  createDOM(config) {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM() {
    return false;
  }

  getSrc() {
    return this.getLatest().__src;
  }

  getAltText() {
    return this.getLatest().__altText;
  }

  decorate() {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()} />
    );
  }
}

export function $createImageNode(
  {
    altText,
    height,
    maxWidth = 500,
    src,
    width,
    key
  }
) {
  return $applyNodeReplacement(new ImageNode(src, altText, maxWidth, width, height, key));
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
