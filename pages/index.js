const l = console.log;
import { customAlphabet } from "nanoid";

import { SpeechProvider } from "@speechly/react-client"
import { PushToTalkButton, TranscriptDrawer, IntroPopup } from "@speechly/react-ui" 

export const nanoid = customAlphabet(
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    8,
);

const speechlyAppId = 'af8e77fd-b35f-4d29-b8a0-e4721c6cc812'

import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect, useMemo } from "react";
//import {Excalidraw} from "@excalidraw/excalidraw";

import styles from '../styles/Home.module.css'

const resolvablePromise = () => {
    let resolve;
    let reject;
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
};

export default function Home() {
    const [Comp, setComp] = useState(null);
    const excalidrawRef = useMemo(
        () => ({
            current: {
                readyPromise: resolvablePromise()
            }
        }),
        []
    );
    useEffect(() => {
        import("@excalidraw/excalidraw").then((comp) => {
            window.excalidraw = comp;
            excalidrawRef.current.readyPromise.then((api) => {
                console.log("loaded", api);
                window.excalidrawApi = api;
            });
            setComp(comp.Excalidraw)
        });
    }, [excalidrawRef]);

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

    const buildText = (text, topX = 0, topY = 0) => {
        const horizontalBoundsPx = 3200;

        const id = nanoid();

        const { width, height, baseline } = ExcalidrawLib.measureText(text,
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

    const syncFolder = function (path) {
        const pathPrefix = '/home/berliangur'
        const sceneEls = api.getSceneElements();
        const textEls = sceneEls.filter(e => e.type == 'text')
        const titleEls = textEls.filter(el => el.text.startsWith(pathPrefix))
        const contentEls = textEls.filter(el => !el.text.startsWith(pathPrefix))
        fetch(`/api/first/?path=${path}`).then(resp => resp.json()).then((ids) => {
            try {
                let newSceneEls = [...sceneEls];
                const ps = [];
                for (const id of ids) {
                    const p = fetch(`http://localhost:8080/dev/second/?.id=${id}`).then(resp => resp.json()).then(resp => {
                        const { title, content } = resp.results[0]
                        return { title, content }
                    })
                    ps.push(p);
                }
                Promise.all(ps).then((files) => {
                    let x = 0
                    for (const file of files) {
                        const { title, content } = file;
                        // existingTileElement
                        const ete = titleEls.find(el => el.text == title);
                        let y = 0;
                        let groupId;
                        if (ete) {
                            // delete existing line elements
                            groupId = ete.groupIds[0];
                            const lineElements = contentEls.filter(el => el.groupIds.find(gid => groupId == gid));
                            newSceneEls = sceneEls.filter(el => !lineElements.find(lel => lel.id == el.id));
                            // remember position of title
                            x = ete.x;
                            y = ete.y + ete.height;
                        } else {
                            const titleEl = {
                                ...buildText(title, x, y),
                                groupIds: [groupId]
                            }
                            newSceneEls.push(titleEl);
                        }
                        // then create line elements in same group with title
                        const lines = content.split('\n');
                        let rowWidth = 0;
                        for (const line of lines) {
                            const lineEl = {
                                ...buildText(line, x, y),
                                groupIds: [groupId]
                            }
                            newSceneEls.push(lineEl);
                            y += style.fontSize * 2;
                            if (lineEl.width > rowWidth) {
                                rowWidth = lineEl.width;
                            }
                        }
                        x += rowWidth + style.fontSize * 2;
                    }
                })
                api.updateScene({
                    elements: newSceneEls,
                })
            } catch (err) {
                console.error(err);
            }
        })
    }

    return <SpeechProvider appId={speechlyAppId}>
        <PushToTalkButton placement="bottom" powerOn="auto"></PushToTalkButton>
        <TranscriptDrawer></TranscriptDrawer>
        <>
            <div style={{ height: "100vh", width: "100vw" }}>{Comp && <Comp
                ref={(api) => {
                    window.api = api;
                    window.nanoid = nanoid;
                    window.first = syncFolder;
                    window.extra = {
                        newElement,
                    }

                    // fetch("/api/eleven11?name=books").then(resp => resp.json()).then((resp) => {
                    //     const { elements, files } = resp;

                    //     api.updateScene({
                    //         elements,
                    //         files,
                    //     })
                    // });
                }}
                onChange={(elements, state) => {
                    console.log("Elements :", elements, "State : ", state)
                }}
                theme={'dark'}
            />}</div>
        </>        
    </SpeechProvider>
}
