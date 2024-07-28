---
title: React-create-rxdb-example
author: TomasLin
tags:
  - Javascript
  - React Native
date: 2020-10-09
categories:
  - React
---

# Install and Initial

```
  $ npx create-react-app rxdbdemo
  $ npm install --save concurrently moment pouchdb-adapter-http pouchdb-adapter-idb pouchdb-server react-toastify rxdb rxjs serve
```

**package.json**

```json
{
  "name": "rxdbdemo",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^4.2.4",
    "@testing-library/react": "^9.3.2",
    "@testing-library/user-event": "^7.1.2",
    "concurrently": "^5.3.0",
    "moment": "^2.29.1",
    "pouchdb-adapter-http": "^7.2.2",
    "pouchdb-adapter-idb": "^7.2.2",
    "pouchdb-server": "^4.2.0",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-scripts": "3.4.3",
    "react-toastify": "^6.0.9",
    "rxdb": "^9.6.0",
    "rxjs": "^6.6.3",
    "serve": "^11.3.2"
  },
  "scripts": {
    "start": "concurrently \"npm run server\" \"react-scripts start\"",
    "server": "pouchdb-server -d ./db",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

```
  $ yarn start
```

會開啟一個本地的 db

可以透過 [pounch-db](http://localhost:5984/_utils/)

# Create Schema

**src/Schema.js**

```javascript
const schema = {
  title: 'Anonymous chat schema',
  description: 'Database schema for an anonymous chat',
  version: 0,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true
    },
    message: {
      type: 'string'
    }
  },
  required: ['message']
}

export default schema;
```

### App.js

```javascript
import React, { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import * as moment from "moment";
import * as RxDB from "rxdb";
import schema from "./Schema";

let localdb = null;
const dbName = "test";
const syncURL = "http://localhost:5984/";

RxDB.addRxPlugin(require("pouchdb-adapter-idb"));
RxDB.addRxPlugin(require("pouchdb-adapter-http"));

const createDatabase = async () => {
  try {
    const db = await RxDB.createRxDatabase({
      name: dbName,
      adapter: "idb",
      password: "12345678",
    });

    db.waitForLeadership().then(() => {
      document.title = "♛ " + document.title;
    });

    const messagesCollection = await db.collection({
      name: "messages",
      schema: schema,
    });

    messagesCollection.sync({ remote: syncURL + dbName + "/" });
    console.log("createDatabase -> messagesCollection", messagesCollection);

    return db;
  } catch (error) {
    console.log("createDatabase -> error", error);
  }
};

const addMessage = async (message, setNewMessage) => {
  console.log("addMessage -> localdb", localdb)
  const id = Date.now().toString();
  const newMessage = { id, message };

  await localdb.messages.insert(newMessage);

  setNewMessage("");
};

const renderMessages = (messages) =>
  messages.map(({ id, message }) => {
    const date = moment(id, 'x').fromNow();
    return (
      <div key={id}>
        <p>{date}</p>
        <p>{message}</p>
        <hr />
      </div>
    )
  });
function App() {
  let dbRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [subs, setSubs] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    createDatabase().then((db) => {
      localdb = db;

      const sub = db.messages
        .find()
        .sort({ id: 1 })
        .$.subscribe((msgs) => {
          if (!msgs) return;
          toast("Reloading messages");
          setMessages(msgs);
        });
      setSubs([...subs, sub]);
    });

    return () => {
      subs.forEach((sub) => sub.unsubscribe());
    };
  }, []);
  return (
    <div className="App">
      <ToastContainer autoClose={3000} />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <div>{renderMessages(messages)}</div>

      <div id="add-message-div">
        <h3>Add Message</h3>
        <input
          type="text"
          placeholder="Message"
          value={newMessage}
          onChange={(env) => setNewMessage(env.target.value)}
        />
        <button onClick={() => addMessage(newMessage, setNewMessage)}>
          Add message
        </button>
      </div>
    </div>
  );
}

export default App;
```

