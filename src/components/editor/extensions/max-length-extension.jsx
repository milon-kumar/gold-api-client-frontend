import { effect, namedSignals } from "@lexical/extension";
import { $trimTextContentFromAnchor } from "@lexical/selection";
import { $restoreEditorState } from "@lexical/utils";
import { $getSelection, $isRangeSelection, RootNode, defineExtension, safeCast } from "lexical";

export const MaxLengthExtension = defineExtension({
  build: (_, config) => namedSignals(config),
  config: safeCast({ disabled: false, maxLength: 3000 }),
  name: "@shadcn-editor/MaxLength",
  register: (editor, _, state) =>
    effect(() => {
      const output = state.getOutput();
      if (output.disabled.value) {
        return;
      }
      const maxLength = output.maxLength.value;
      let lastRestoredEditorState = null;
      return editor.registerNodeTransform(RootNode, (rootNode) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          return;
        }
        const prevEditorState = editor.getEditorState();
        const prevTextContentSize = prevEditorState.read(() =>
          rootNode.getTextContentSize());
        const textContentSize = rootNode.getTextContentSize();
        if (prevTextContentSize !== textContentSize) {
          const delCount = textContentSize - maxLength;
          const anchor = selection.anchor;

          if (delCount > 0) {
            // Restore the old editor state instead if the last
            // text content was already at the limit.
            if (
              prevTextContentSize === maxLength &&
              lastRestoredEditorState !== prevEditorState
            ) {
              lastRestoredEditorState = prevEditorState;
              $restoreEditorState(editor, prevEditorState);
            } else {
              $trimTextContentFromAnchor(editor, anchor, delCount);
            }
          }
        }
      });
    }),
});
