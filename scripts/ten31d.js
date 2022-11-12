const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))


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

const findTitleElement = (title) => {
    for (const el of elements) {
        if (el.text == title) {
            return el;
        }
    }
    return null;
}

const findContentElement = (titleElement) => {
    const groupId = titleElement.groupIds.pop();
    for (const el of elements) {
        if (el.groupIds.pop() == groupId && el.id != titleElement.id) {
            return el;
        }
    }
    return null;
}

const deleteFile = (id) => fetch(`http://localhost:8080/dev/second/${id}`, { method: "DELETE" }).then(resp => resp.json())


const ten31d = async () => {
    const files = await fetchFiles();

    const els0 = api.getSceneElements().filter(e => e.type == 'text')
    const els1 = els0.filter(el => el.text.startsWith('home/berliangur'))
    const els2 = els0.filter(el => !el.text.startsWith('home/berliangur'))

    let els = [];

    let x = 0, y = 0;
    let rowHeight = 0, rowWidth = 0;
    for (const file of files) {
        const {title, content} = file;

        deleteFile(file.id);

        const el1 = els1.find(el => el.text == title);
        if (el1) {
            const groupId = el1.groupIds[0];
            const el2 = els2.find(el => el.groupIds[0] == groupId);
            el2.text = content;
            const {width, height, baseline} = ExcalidrawLib.measureText(el2.text,
                `${style.fontSize}px ${getFontFamily(style.fontFamily)}`,
                horizontalBoundsPx
            );
            el2.width = width;
            el2.height = height;
            el2.baseline = baseline;
            continue;
        }

        const groupId = nanoid();
        if (rowWidth > horizontalBoundsPx) {
            x = 0;
            y += rowHeight;
            rowHeight = 0;
            rowWidth = 0;
        }
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

    api.updateScene({
        elements: [
            ...api.getSceneElements(),
            ...els,
        ],
    })
}

async function doTen31d() {
    await ten31d();
    api.refresh();
    await sleep(2500);
}

