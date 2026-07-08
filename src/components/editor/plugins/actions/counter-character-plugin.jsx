import { useEffect, useState } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $rootTextContent } from "@lexical/text";

let textEncoderInstance = null;

function textEncoder() {
  if (window.TextEncoder === undefined) {
    return null;
  }

  if (textEncoderInstance === null) {
    textEncoderInstance = new window.TextEncoder();
  }

  return textEncoderInstance;
}

function utf8Length(text) {
  const currentTextEncoder = textEncoder();

  if (currentTextEncoder === null) {
    // http://stackoverflow.com/a/5515960/210370
    const m = encodeURIComponent(text).match(/%[89ABab]/g);
    return text.length + (m ? m.length : 0);
  }

  return currentTextEncoder.encode(text).length;
}

const strlen = (text, charset) => {
  if (charset === "UTF-8") {
    return utf8Length(text);
  } else if (charset === "UTF-16") {
    return text.length;
  }
};

const countWords = (text) => {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
};

export function CounterCharacterPlugin({
  charset = "UTF-16"
}) {
  const [editor] = useLexicalComposerContext();
  const [stats, setStats] = useState(() => {
    const initialText = editor.getEditorState().read($rootTextContent);
    return {
      characters: strlen(initialText, charset),
      words: countWords(initialText),
    };
  });

  useEffect(() => {
    return editor.registerTextContentListener((currentText) => {
      setStats({
        characters: strlen(currentText, charset),
        words: countWords(currentText),
      });
    });
  }, [editor, charset]);

  return (
    <div className="flex gap-2 text-xs whitespace-nowrap text-gray-500">
      <p>{stats.characters} characters</p>|<p>{stats.words} words</p>
    </div>
  );
}
