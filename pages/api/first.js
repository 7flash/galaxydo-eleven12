import recursive from "recursive-readdir"
import ignore from "ignore"
import fetch from "node-fetch";
import fs from "fs"
import ignorePaths from './lib/ignorePaths';

const ig = ignore().add(ignorePaths)

const url = "http://localhost:8080/dev/second"

const maxContentChars = 95000;

export default function handler(req, res) {
  try {
    const { path } = req.query;
    console.log({ path })

    recursive(path, (err, files) => {
      try {
        if (err) throw err;
        const acceptableFiles = ig.filter(files.map(f => f.substring(1)))
        const ps = [];
        for (const filePath of acceptableFiles) {
          const p = new Promise(resolve => {
            const title = filePath;
            fs.readFile(`/${filePath}`, 'utf8', (err, fileContent) => {
              try {
                if (err) throw err;
                const content = fileContent;
                const tooLong = content.length > maxContentChars;
                if (tooLong) {
                  return resolve(null);
                }
                fetch(`${url}/?.title=${title}`).then(resp => resp.json()).then((resp) => {
                  const alreadyExists = resp.results.length > 0;
                  if (alreadyExists) {
                    if (resp.results.length == 1) {
                      const id = resp.results[0].id
                      fetch(`${url}/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                          title: title,
                          content: content,
                        })
                      }).then(resp => resp.json()).then(resp => {
                        return resolve(resp.id);
                      })
                    } else {
                      throw 'duplicate db elements';
                    }
                    
                  } else {
                    fetch(url, {
                      method: 'POST',
                      body: JSON.stringify({
                        title: title,
                        content: content,
                      })
                    }).then(resp => resp.json()).then((resp) => {
                      resolve(resp.id)
                    })
                  }
                });
              } catch (err) {
                res.status(500).json({ third: err.toString() })
              }
            })
          })
          ps.push(p)
        }
        Promise.all(ps).then(results => results.filter(r => r != null)).then((results) => {
          console.log("results", results.length);
          res.status(200).json(results)
        })
      } catch (err) {
        res.status(500).json({ second: err.toString() })
      }

    })
  } catch (err) {
    res.status(500).json({ first: err.toString() })
  }
}
