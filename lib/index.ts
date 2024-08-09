import { EditorView } from "codemirror";

export const vsCodeTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#1E1E1E !important",
      height: "100%",
      fontSize: "20px",
      color: "white",
    },
    ".cm-content": {
      caretColor: "#A9B7C6",
      color: "#D4D4D4",
    },
    ".cm-cursor": {
      borderLeftColor: "#A9B7C6",
    },
    ".cm-gutters": {
      backgroundColor: "#1E1E1E",
      color: "#858585",
      border: "none",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#2C323C",
    },
    ".cm-lineNumbers": {
      color: "#858585",
    },
    ".cm-line": {
      backgroundColor: "#1E1E1E",
    },
    ".cm-activeLine": {
      backgroundColor: "#2C323C",
    },
    ".cm-selectionMatch": {
      backgroundColor: "#3A3D41",
    },
    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      backgroundColor: "#3A3D41",
      color: "#D4D4D4",
    },
    ".cm-searchMatch": {
      backgroundColor: "#515C6A",
    },
    ".cm-selectionBackground": {
      backgroundColor: "#264F78",
    },
  },
  { dark: true }
);