
export function shortcuts(e) {
    if (e.key === "Tab") {
        e.preventDefault();

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);

        const tabNode = document.createTextNode("    ");

        range.deleteContents();
        range.insertNode(tabNode);

        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode);

        selection.removeAllRanges();
        selection.addRange(range);
    }
    if (e.key === "{") {
        e.preventDefault();

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);

        const rode = document.createTextNode("{");
        const lode = document.createTextNode("}");

        range.deleteContents();
        range.insertNode(lode);
        range.insertNode(rode);

        range.setStartAfter(lode);
        range.setEndAfter(rode);

        selection.removeAllRanges();
        selection.addRange(range);
    }
    if (e.key === "[") {
        e.preventDefault();

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);

        const rode = document.createTextNode("[");
        const lode = document.createTextNode("]");

        range.deleteContents();
        range.insertNode(lode);
        range.insertNode(rode);

        range.setStartAfter(lode);
        range.setEndAfter(rode);

        selection.removeAllRanges();
        selection.addRange(range);
    }
    if (e.key === "(") {
        e.preventDefault();

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);

        const rode = document.createTextNode("(");
        const lode = document.createTextNode(")");

        range.deleteContents();
        range.insertNode(lode);
        range.insertNode(rode);

        range.setStartAfter(lode);
        range.setEndAfter(rode);

        selection.removeAllRanges();
        selection.addRange(range);
    }
    if (e.key === "Enter") {
        e.preventDefault();

        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        const currentNode = range.startContainer;

        let lineText = currentNode.textContent || "";

        const match = lineText.match(/^[\t ]+/);
        const indent = match ? match[0] : "";

        const newline = document.createTextNode("\n" + indent);

        range.deleteContents();
        range.insertNode(newline);

        range.setStartAfter(newline);
        range.setEndAfter(newline);

        selection.removeAllRanges();
        selection.addRange(range);
    }
}