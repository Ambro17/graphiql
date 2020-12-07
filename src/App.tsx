import React from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';

class App extends React.Component {
    _graphiql: any;

    render() {
        return (
            <GraphiQL
                ref={ref => (this._graphiql = ref)}
                fetcher={async graphQLParams => {
                const data = await fetch(
                    'https://swapi-graphql.netlify.app/.netlify/functions/index',
                    {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(graphQLParams),
                    credentials: 'same-origin',
                    },
                );
                return data.json().catch(() => data.text());
            }}
            >

            {/* ------- Logo ---------- */}
            <GraphiQL.Logo>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                    <img
                    alt="PostGraphile logo"
                    src="https://www.graphile.org/images/postgraphile-tiny.optimized.svg"
                    width="32"
                    height="32"
                    style={{ marginTop: '4px', marginRight: '0.5rem' }}
                    />
                </div>
                <div>
                    Graph
                    <em>i</em>
                    QL
                </div>
                </div>
            </GraphiQL.Logo>
        {/* ------- Buttons ---------- */}
        {
            /*
            Prettify
            History
            Explorer
            -----------
            Code Exporter
            Voyager
            */
        }
        <GraphiQL.Toolbar>
            <GraphiQL.Button
                onClick={() => this._graphiql.handlePrettifyQuery()}
                title="Prettify Query (Shift-Ctrl-P)"
                label="Prettify"
            />
        </GraphiQL.Toolbar>
        {/*
            <GraphiQL.Button
                onClick={() => this._graphiql.handleToggleHistory()}
                label="History"
                title="Show History"
            />
            <GraphiQL.Button
                onClick={this._handleToggleExplorer}
                label="Explorer"
                title="Toggle Explorer"
            />
            </GraphiQL.Toolbar> */}
    </GraphiQL>
      );
    }
}

export default App;
