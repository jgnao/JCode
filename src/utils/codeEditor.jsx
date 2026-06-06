import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { php } from "@codemirror/lang-php";
import { cpp } from "@codemirror/lang-cpp";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const jcodeHighlight = HighlightStyle.define([
  {
    tag: tags.keyword,
    color: "#ee3954",
  },

  {
    tag: [tags.string, tags.special(tags.string)],
    color: "#a5d3ff",
  },

  {
    tag: tags.comment,
    color: "#71717a",
    fontStyle: "italic",
  },

  {
    tag: [tags.number, tags.integer, tags.float],
    color: "#f97316",
  },

  {
    tag: [tags.function(tags.variableName), tags.function(tags.propertyName)],
    color: "#a365e2",
  },

  {
    tag: tags.variableName,
    color: "#e696ff",
  },

  {
    tag: tags.propertyName,
    color: "#a78bfa",
  },

  {
    tag: tags.operator,
    color: "#f43f5e",
  },

  {
    tag: [
      tags.punctuation,
      tags.bracket,
      tags.angleBracket,
      tags.separator,
    ],
    color: "#ef4444",
  },

  {
    tag: tags.tagName,
    color: "#fb7185",
    fontWeight: "600",
  },

  {
    tag: tags.attributeName,
    color: "#c084fc",
  },

  {
    tag: tags.attributeValue,
    color: "#f8fafc",
  },

  {
    tag: tags.className,
    color: "#a78bfa",
  },

  {
    tag: tags.typeName,
    color: "#38bdf8",
  },

  {
    tag: tags.constant(tags.name),
    color: "#f59e0b",
  },

  {
    tag: tags.bool,
    color: "#f97316",
  },

  {
    tag: tags.null,
    color: "#f97316",
  },

  {
    tag: tags.url,
    color: "#22d3ee",
  },

  {
    tag: tags.regexp,
    color: "#06b6d4",
  },
]);

export default function CodeEditor({ value, onChange, arquivo, ext, salvar }) {
  const ref = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    function getLanguage(ext) {
      switch (ext) {
        case "js":
          return javascript();
        case "html":
          return html();
        case "php":
          return php();
        case "css":
          return cpp();
        case "cpp":
          return cpp();
        default:
          return [];
      }
    }

    const lettersize = EditorView.theme(
      {
        ".cm-line": {fontSize: localStorage.getItem("font-size") ? localStorage.getItem("font-size") +"px" : "14px"}
      }
    )

    const state = EditorState.create({
      doc: value || "",
      extensions: [
        basicSetup,
        getLanguage(ext),
        syntaxHighlighting(jcodeHighlight),
        lettersize,

        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange?.(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: ref.current,
    });

    viewRef.current = view;

    return () => view.destroy();
  }, []);


  useEffect(() => {
    const view = viewRef.current;

    if (!view) return;

    const currentText = view.state.doc.toString();

    if (currentText === value) return;

    view.dispatch({
      changes: {
        from: 0,
        to: currentText.length,
        insert: value || "",
      },
    });
  }, [value]);

  return <div className="code-input" ref={ref} onInput={() => {
    let autosave = localStorage.getItem("autosave")
    if (autosave == "false") return;
    salvar();
  }} />;
}