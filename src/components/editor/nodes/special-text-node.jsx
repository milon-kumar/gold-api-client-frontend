import { addClassNamesToElement } from "@lexical/utils";
import { $applyNodeReplacement, TextNode } from "lexical";

export class SpecialTextNode extends TextNode {
  static getType() {
    return "specialText";
  }

  static clone(node) {
    return new SpecialTextNode(node.__text, node.__key);
  }

  createDOM(config) {
    const dom = document.createElement("span");
    addClassNamesToElement(dom, config.theme.specialText);
    dom.textContent = this.getTextContent();
    return dom;
  }

  updateDOM(prevNode, dom, config) {
    if (prevNode.__text.startsWith("[") && prevNode.__text.endsWith("]")) {
      const strippedText = this.__text.substring(1, this.__text.length - 1); // Strip brackets again
      dom.textContent = strippedText; // Update the text content
    }

    addClassNamesToElement(dom, config.theme.specialText);

    return false;
  }

  static importJSON(serializedNode) {
    return $createSpecialTextNode().updateFromJSON(serializedNode);
  }

  isTextEntity() {
    return true;
  }
  canInsertTextAfter() {
    return false; // Prevents appending text to this node
  }
}

export function $createSpecialTextNode(text = "") {
  return $applyNodeReplacement(new SpecialTextNode(text));
}

export function $isSpecialTextNode(node) {
  return node instanceof SpecialTextNode;
}
