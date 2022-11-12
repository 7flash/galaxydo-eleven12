const throttle = async (fn, items, size) => {
    while (items.length > 0) {
        const bucket = [];
        const s = size > items.length ? items.length : size;
        for (let i = 0; i < s; i++) {
            bucket.push(items.pop());
        }
        await fn(bucket);
    }
}

const ids = await fetch(url).then(resp => resp.json()).then((res) => res.results.map((el) => el.id))

const deleteFn = (id) => fetch(`${url}/${id}`, { method: "DELETE" }).then(resp => resp.json())

const ids = await fetch('http://localhost:8080/dev/second').then(resp => resp.json()).then((res) => res.results.map((el) => el.id))
const deleteFile = (id) => fetch(`http://localhost:8080/dev/second/${id}`, { method: "DELETE" }).then(resp => resp.json())
throttle((bucket) => {
    return Promise.all(
            bucket.map(item => deleteFile(item))
            );
    }, ids, 100);

const ids2 = [];
const insertFn = (item) => fetch("http://localhost:8080/dev/third", { method: "POST", body: JSON.stringify(item) }).then((resp) => resp.json()).then((resp) => { ids2.push(resp.id) })

throttle((bucket) => {
    return Promise.all(
            bucket.map(item => insertFn(item))
            );
    }, els, 25);

const els = api.getSceneElements().filter(el => el.type == 'text');

await fetch("http://localhost:8080/dev/fourth", { method: "POST", body: JSON.stringify({
    title: "nextjs examples - October 31",
    elements: ids2
})}).then(resp => resp.json())

api.resetScene()

const ids3 = await fetch("http://localhost:8080/dev/fourth").then(resp => resp.json()).then(resp => resp.elements)

const ids3 = await fetch("http://localhost:8080/dev/fourth/?.title=nextjs examples - October 31").then(resp => resp.json()).then(resp => resp.results[0].elements)
const els31 = [];
throttle((bucket) => {
    return Promise.all(bucket.map(async (item) => {
        const element = await fetch(`http://localhost:8080/dev/third/?.id=${item}`)
        els31.push(element)
    }))
}, ids3, 10);
const els312 = els31.map(el => el.json().then(resp => resp.results[0]))
const els313 = await Promise.all(els312)
api.updateScene({
    elements: els313,
})
 
api.getSceneElements().filter(el => el.text.includes('home/berliangur/ten23/Portal/amplify/'))

const els0 = api.getSceneElements()
const els1 = els0.filter(el => el.text.includes('home/berliangur/ten23/Portal/amplify/'))
const els2 = els1.map(ela => els0.find((elb) => ela.groupIds[0] == elb.groupIds[0] && ela.id != elb.id))
const els3 = [...els1, ...els2]
// selectElements