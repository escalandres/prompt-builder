/**
 * XML Formatter
 *
 * Servicio encargado de:
 * - Formatear XML
 * - Indentar correctamente
 * - Eliminar espacios innecesarios
 * - Normalizar saltos de línea
 *
 * No genera el XML.
 * Solamente le da formato.
 */

/* ---------------------------------------------------------- */
/* Formatter principal                                         */
/* ---------------------------------------------------------- */

export function formatXML(xml, indentSize = 4) {

    if (!xml) {
        return "";
    }

    xml = normalizeLineBreaks(xml);

    xml = removeTrailingSpaces(xml);

    xml = indentXML(xml, indentSize);

    return xml.trim();

}

/* ---------------------------------------------------------- */
/* Pretty Print                                                */
/* ---------------------------------------------------------- */

export function prettyPrint(xml) {

    return formatXML(xml);

}

/* ---------------------------------------------------------- */
/* Compact                                                     */
/* ---------------------------------------------------------- */

export function compactXML(xml) {

    return xml

        .replace(/\>\s+\</g, "><")

        .replace(/\n+/g, "")

        .trim();

}

/* ---------------------------------------------------------- */
/* Normalize Line Breaks                                       */
/* ---------------------------------------------------------- */

export function normalizeLineBreaks(xml) {

    return xml.replace(/\r\n/g, "\n");

}

/* ---------------------------------------------------------- */
/* Remove trailing spaces                                      */
/* ---------------------------------------------------------- */

export function removeTrailingSpaces(xml) {

    return xml

        .split("\n")

        .map(line => line.trimEnd())

        .join("\n");

}

/* ---------------------------------------------------------- */
/* XML Indenter                                                */
/* ---------------------------------------------------------- */

export function indentXML(xml, indentSize = 4) {

    const INDENT = " ".repeat(indentSize);

    let level = 0;

    const output = [];

    const lines = xml

        .replace(/>\s*</g, ">\n<")

        .split("\n")

        .filter(line => line.trim() !== "");

    lines.forEach(line => {

        const trimmed = line.trim();

        const isClosing = /^<\//.test(trimmed);

        const isSelfClosing = /\/>$/.test(trimmed);

        const isDeclaration = /^<\?/.test(trimmed);

        if (isClosing) {

            level = Math.max(
                0,
                level - 1
            );

        }

        output.push(

            INDENT.repeat(level) + trimmed

        );

        const isOpening =

            /^<[^!?/][^>]*>$/.test(trimmed) &&
            !isClosing &&
            !isSelfClosing &&
            !isDeclaration &&
            !trimmed.includes("</");

        if (isOpening) {

            level++;

        }

    });

    return output.join("\n");

}

/* ---------------------------------------------------------- */
/* Minify                                                      */
/* ---------------------------------------------------------- */

export function minifyXML(xml) {

    return compactXML(xml);

}

/* ---------------------------------------------------------- */
/* Validate Formatting                                         */
/* ---------------------------------------------------------- */

export function isFormatted(xml) {

    return formatXML(xml) === xml;

}

/* ---------------------------------------------------------- */
/* Beautify Alias                                              */
/* ---------------------------------------------------------- */

export function beautifyXML(xml) {

    return formatXML(xml);

}