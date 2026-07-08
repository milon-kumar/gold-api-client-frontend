import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createPortal } from "react-dom";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useBasicTypeaheadTriggerMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { LexicalTypeaheadMenuPlugin } from "@lexical/react/LexicalTypeaheadMenuPlugin";

import { useEditorModal } from "@/components/editor/editor-hooks/use-modal";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

// const LexicalTypeaheadMenuPlugin = lazy(
//   () =>
//     import("@lexical/react/LexicalTypeaheadMenuPlugin").then(
//       (mod) => mod.LexicalTypeaheadMenuPlugin<ComponentPickerOption>
//     ),
// )

function ComponentPickerMenu({
  options,
  selectedIndex,
  selectOptionAndCleanUp,
  setHighlightedIndex
}) {
  const itemRefs = useRef([]);

  useEffect(() => {
    if (selectedIndex !== null && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "auto",
      });
    }
  }, [selectedIndex]);

  return (
    <div
      className="bg-popover text-popover-foreground absolute h-min min-w-48 rounded-md border shadow-md">
      <Command
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex(selectedIndex !== null
              ? (selectedIndex - 1 + options.length) % options.length
              : options.length - 1);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex(selectedIndex !== null ? (selectedIndex + 1) % options.length : 0);
          }
        }}>
        <CommandList className="w-56">
          <CommandGroup>
            {options.map((option, index) => (
              <CommandItem
                key={option.key}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                value={option.title}
                onSelect={() => {
                  selectOptionAndCleanUp(option);
                }}
                className={cn("flex items-center gap-2", selectedIndex === index
                  ? "bg-accent text-accent-foreground"
                  : "bg-transparent!")}>
                {option.icon}
                {option.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

export function ComponentPickerMenuPlugin(
  {
    baseOptions = [],
    dynamicOptionsFn
  }
) {
  const [editor] = useLexicalComposerContext();
  const [modal, showModal] = useEditorModal();
  const [queryString, setQueryString] = useState(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  });

  const options = useMemo(() => {
    if (!queryString) {
      return baseOptions;
    }

    const regex = new RegExp(queryString, "i");

    return [
      ...(dynamicOptionsFn?.({ queryString }) || []),
      ...baseOptions.filter((option) =>
        regex.test(option.title) ||
        option.keywords.some((keyword) => regex.test(keyword))),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, queryString, showModal]);

  const onSelectOption = useCallback((
    selectedOption,
    nodeToRemove,
    closeMenu,
    matchingString,
  ) => {
    editor.update(() => {
      nodeToRemove?.remove();
      selectedOption.onSelect(matchingString, editor, showModal);
      closeMenu();
    });
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [editor]);

  return (
    <>
      {modal}
      <LexicalTypeaheadMenuPlugin
        onQueryChange={setQueryString}
        onSelectOption={onSelectOption}
        triggerFn={checkForTriggerMatch}
        options={options}
        menuRenderFn={(
          anchorElementRef,
          { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
        ) => {
          return anchorElementRef.current && options.length
            ? createPortal(<ComponentPickerMenu
            options={options}
            selectedIndex={selectedIndex}
            selectOptionAndCleanUp={selectOptionAndCleanUp}
            setHighlightedIndex={setHighlightedIndex} />, anchorElementRef.current)
            : null;
        }} />
    </>
  );
}
