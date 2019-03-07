import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import Resizer from "./Resizer";
import "./styles.css";

function App() {
    return (
        <div className="App">
            <div className="container">
                <div className="col1">
                    <div className="sideBar">
                        <ul>
                            <li> item 1</li>
                            <li> item 2</li>
                            <li> item 3</li>
                            <li> item 4</li>
                            <li> item 5</li>
                        </ul>
                    </div>
                </div>
                <div className="col2">
                    <div className="hederbar">
                        <h1>Heading 1</h1>
                    </div>
                    <div className="drawingArea">
                        <Resizer>
                            <div>cijo</div>
                        </Resizer>
                    </div>
                </div>
            </div>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
