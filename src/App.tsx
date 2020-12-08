import React from 'react';
import GraphiQL from 'graphiql';
import GraphiQLExplorer from 'graphiql-explorer';
import {getIntrospectionQuery, buildClientSchema} from 'graphql';
import 'graphiql/graphiql.min.css';


const fetcher = async(graphQLParams: any) => {
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
} 

class App extends React.Component {
    _graphiql: any; // https://github.com/OneGraph/graphiql-explorer-example/blob/master/src/App.js#L87
    state = { schema: null, query: '# Hola!', explorerIsOpen: true };

    _handleToggleExplorer = () => {
        this.setState({ explorerIsOpen: !this.state.explorerIsOpen });
    };

    _handleEditQuery = (query: string): void => this.setState({ query });
   

    componentDidMount() {
        // Update the schema for the first time. Log an error if we fail.
        this.updateSchema(); 
    }

    executeQuery = async (graphQLParams: any) => {
        const response = await fetch('https://swapi-graphql.netlify.app/.netlify/functions/index', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
        },
          credentials: 'same-origin',
          body: JSON.stringify(graphQLParams),
        });
    
        const result = await response.json();   
        return result;
    }    
    async updateSchema() {
        try {
          // Fetch the schema using our introspection query and report once that has
          // finished.
          const { data } = await this.executeQuery({ query: getIntrospectionQuery() });
    
          // Use the data we got back from GraphQL to build a client schema (a
          // schema without resolvers).
          const schema = buildClientSchema(data);
    
          // Update our component with the new schema.
          this.setState({ schema });
    
          // Do some hacky stuff to GraphiQL.
//          this._updateGraphiQLDocExplorerNavStack(schema);
    
          // tslint:disable-next-line no-console
          console.log('PostGraphile: Schema updated');
          this.setState({ error: null });
        } catch (error) {
          // tslint:disable-next-line no-console
          console.error('Error occurred when updating the schema:');
          // tslint:disable-next-line no-console
          console.error(error);
          this.setState({ error });
        }
    }


    render() { 
        const {query, schema} = this.state
        return (
        <div className="graphiql-container">
        <GraphiQLExplorer
            schema={schema}
            query={query}
            onEdit={this._handleEditQuery}
            onRunOperation={(operationName: string) => this._graphiql.handleRunQuery(operationName)}
            explorerIsOpen={this.state.explorerIsOpen}
            onToggleExplorer={this._handleToggleExplorer}
        />

        <GraphiQL
            ref={ref => (this._graphiql = ref)}
            fetcher={fetcher}
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
                <GraphiQL.Button
                    onClick={() => this._graphiql.handleToggleHistory()}
                    label="History"
                    title="Show History"
                />
                <GraphiQL.Button
                    label="Explorer"
                    title="Construct a query with the GraphiQL explorer"
                    onClick={this._handleToggleExplorer}
                />
            </GraphiQL.Toolbar>
        </GraphiQL>
        </div>
      );
    }
}

export default App;
