const style = {
    strokeColor: "#000000",
    backgroundColor: "transparent",
    angle: 0,
    fillStyle: "hachure",
    strokeWidth: 1,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    strokeSharpness: "sharp",
    fontFamily: 3,
    fontSize: 2,
    textAlign: "left",
    verticalAlign: "top",
    startArrowHead: null,
    endArrowHead: "arrow"
}

const boxedElement = (
    id,
    eltype,
    x,
    y,
    w,
    h,
) => {
    return {
        id,
        type: eltype,
        x,
        y,
        width: w,
        height: h,
        angle: style.angle,
        strokeColor: style.strokeColor,
        backgroundColor: style.backgroundColor,
        fillStyle: style.fillStyle,
        strokeWidth: style.strokeWidth,
        strokeStyle: style.strokeStyle,
        roughness: style.roughness,
        opacity: style.opacity,
        strokeSharpness: style.strokeSharpness,
        seed: Math.floor(Math.random() * 100000),
        version: 1,
        versionNonce: Math.floor(Math.random() * 1000000000),
        updated: Date.now(),
        isDeleted: false,
        groupIds: [],
        boundElements: [],
        link: null,
        locked: false,
    };
}

const getFontFamily = (id) => {
    switch (id) {
        case 1:
            return "Virgil, Segoe UI Emoji";
        case 2:
            return "Helvetica, Segoe UI Emoji";
        case 3:
            return "Cascadia, Segoe UI Emoji";
        case 4:
            return "LocalFont";
    }
}

const horizontalBoundsPx = 3200;

const buildText = (text, topX = 0, topY = 0) => {
    const id = nanoid();

    const {width, height, baseline} = ExcalidrawLib.measureText(text,
        `${style.fontSize}px ${getFontFamily(style.fontFamily)}`,
        horizontalBoundsPx
    );

    return {
        text,
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
        baseline,
        ...boxedElement(id, "text", topX, topY, width, height),
        containerId: null,
        originalText: text,
        rawText: text,
    }
}

const fetchFiles = async () => {
    const url = "http://localhost:8080/dev/second/?limit=5000"

    const files = await fetch(url).then(resp => resp.json()).then((res) => res.results);

    return files;
}

const ten31b = async () => {
    const files = await fetchFiles();

    const grouped = files.reduce((result, file) => {
        const {title} = file;
        const key = title.split('/')[5];
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(file);
        return result;
    }, {});

    let els = [];

    let x = 0, y = 0;
    let rowHeight = 0, rowWidth = 0;

    for (const key of Object.keys(grouped)) {
        x = 0;
        y += rowHeight;
        rowHeight = 0;
        rowWidth = 0;

        const files2 = grouped[key];

        for (const file of files2) {
            const {title, content} = file;

            const groupId = nanoid();

            const titleEl = {
                ...buildText(title, x, y),
                groupIds: [groupId],
            }
            const contentEl = {
                ...buildText(content, x, y + style.fontSize * 2),
                groupIds: [groupId],
            }
            els.push(titleEl);
            els.push(contentEl);
            const groupWidth = titleEl.width > contentEl.width ? titleEl.width : contentEl.width;
            x += groupWidth;
            x += style.fontSize;
            rowWidth += groupWidth;
            if (contentEl.height > rowHeight) {
                rowHeight = contentEl.height + titleEl.height + style.fontSize;
            }
        }
    }

    api.updateScene({
        elements: els,
    })
}

ten31b();