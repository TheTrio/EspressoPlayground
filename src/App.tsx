import { Evaluator, Parser } from 'espressolang'
import React, { useState } from 'react'
import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-jsx'
import 'prismjs/themes/prism-dark.min.css'
import './App.css'

import data from './data.json'
import { MarkdownViewer } from 'react-github-markdown'

function App() {
  const [code, setCode] = useState(data.Blocks[0].code)
  const [output, setOutput] = useState('')
  return (
    <div className="flex flex-col p-4 gap-4">
      <h1 className="text-3xl font-bold font-mono">Espresso Playground</h1>
      <div className="grid grid-cols-[1fr_2fr] gap-2">
        <div className="py-2 flex flex-col gap-3">
          <p>
            This is a website to play around with Espresso, a programming
            language that I created to learn more about compilers and language
            design.
          </p>
          <p>
            You can type your code in the editor to the right and click on the
            run button to see the output.
          </p>
          <p>
            I go through the language features in the sections below, but I
            would say that the most interesting feature is the fact that
            everything in the language is an expression. From if statements to
            loops, everything returns a value.
          </p>
          <p>
            If you want to try the language on your machine, you can install the
            interpreter from npm
          </p>
          <Editor
            value={`$ npm install -g espressolang`}
            onValueChange={() => {}}
            highlight={(code) => highlight(code, languages.js, 'javascript')}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
            }}
          />
          <p>
            You can find the source code for the language{' '}
            <a
              href="https://github.com/TheTrio/Espresso"
              className="text-cyan-500 hover:text-cyan-800 transition-colors"
              target="_blank"
            >
              here
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-2 relative">
          <button
            className="absolute right-2 top-2 bg-cyan-500 text-white py-2 px-4 rounded-md z-20 hover:bg-cyan-800 hover:cursor-pointer transition-colors"
            onClick={() => {
              try {
                const parser = new Parser(code)
                const tree = parser.parse()
                const redirectTo: string[] = []
                const evaluator = new Evaluator(tree, {
                  redirectTo,
                })
                evaluator.evaluate()
                setOutput(redirectTo.join('\n'))
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (e: any) {
                setOutput(e.message)
              }
            }}
          >
            ▶
          </button>
          <div className="h-70 overflow-auto border border-gray-300 rounded-md">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => highlight(code, languages.js, 'javascript')}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}
              placeholder="Type your code here"
              className=" min-h-70 bg-gray-800 text-white border border-gray-300 rounded-md p-2"
            />
          </div>
          <textarea
            value={output}
            placeholder="Output will be shown here"
            disabled
            className="bg-gray-800 text-white border border-gray-300 rounded-md p-2"
          ></textarea>
        </div>
      </div>
      <h1 className="text-3xl font-bold font-mono">Language Features</h1>
      <ul className="flex flex-col pl-8">
        {Object.keys(data).map((key, i) => (
          <li key={i}>
            <a
              href={`#${key}`}
              className="text-cyan-500 hover:text-cyan-800 transition-colors"
            >
              {key}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex gap-4 flex-col">
        {Object.keys(data).map((key, i) => (
          <React.Fragment key={i}>
            <h1 className="text-2xl font-bold font-mono text-gray-700" id={key}>
              {key}
            </h1>
            <div className="grid grid-cols-2 gap-4">
              {data[key as keyof typeof data].map((item, i) => (
                <React.Fragment key={i}>
                  <MarkdownViewer
                    value={item.explanation}
                    isDarkTheme={false}
                  />
                  <div className="relative">
                    {item.code ? (
                      <>
                        <button
                          className="absolute right-2 top-2 bg-cyan-500 text-white py-2 px-4 rounded-md z-20 hover:bg-cyan-800 hover:cursor-pointer transition-colors"
                          onClick={() => {
                            setCode(item.code)
                            document.body?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            })
                            try {
                              const parser = new Parser(item.code)
                              const tree = parser.parse()
                              const redirectTo: string[] = []
                              const evaluator = new Evaluator(tree, {
                                redirectTo,
                              })
                              evaluator.evaluate()
                              setOutput(redirectTo.join('\n'))
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            } catch (e: any) {
                              setOutput(e.message)
                            }
                          }}
                        >
                          ▶
                        </button>
                        <Editor
                          value={item.code}
                          onValueChange={() => {}}
                          disabled
                          highlight={(code) =>
                            highlight(code, languages.js, 'javascript')
                          }
                          padding={10}
                          style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 12,
                          }}
                          className="bg-gray-800 text-white border border-gray-300 rounded-md p-2"
                        ></Editor>
                      </>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default App
