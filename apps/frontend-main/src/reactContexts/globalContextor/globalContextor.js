/* eslint-disable react/no-unused-state */

import React, { Component } from 'react';
import browserStorage from 'store2';

const defaultContextValues = {
    contextState: {
        currentUser: {},
    },
    contextActions: {
        updateCurrentUserData: () => {},
    },
};

// Context Itself.
export const GlobalContext = React.createContext(defaultContextValues);

// This should be used wrap <App/> with it. Similar to ReactRouter.
export class GlobalContextProvider extends Component {
    constructor(props) {
        super(props);

        // Getting persisted "Global Context Data" from Local Storage, if available.
        const rawPersistedContextData =
            browserStorage.get('globalContextPersistedData') || {};
        const persistedContextData = JSON.parse(rawPersistedContextData);

        this.state = {
            ...defaultContextValues.contextState,
            ...persistedContextData,
        };
    }

    // ----------------------------------- Actions to Update Context State Data -----------------------------------

    updateCurrentUserData(currentUserData = {}) {
        this.setState({
            currentUser: currentUserData,
        });
    }

    render() {
        const { children } = this.props;

        // Persisting "Global Context State" on Local Storage with Every Access/Update on context.
        // So for initial load we can get persisted data from local storage. (See constructor())
        browserStorage.set(
            'globalContextPersistedData',
            JSON.stringify(this.state),
        );

        // This is what get by any React Component/Element that consume our "GlobalContext"
        const providerValue = {
            contextState: this.state,
            contextActions: {
                updateCurrentUserData: (...args) =>
                    this.updateCurrentUserData(...args),
            },
        };

        return (
            <GlobalContext.Provider value={providerValue}>
                <div className='GLOBAL_CONTEXT_PROVIDER_WRAPPER'>
                    {children}
                </div>
            </GlobalContext.Provider>
        );
    }
}

// This can be used to directly access Context from anywhere inside "<GlobalContext.Provider/>"
// USAGE TIP : Direct children must be a function to access context. Then within that function return Components you need.
// OTHER WAYS :
// 			- We have also created a HOC to consume this context. Check below 'withGlobalContext()' HOC.
// 			- Also in class components we can do 'xxx.contextType=GlobalContext" OR "static contextType=GlobalContext" to directly access it.
export function GlobalContextConsumer({ children }) {
    return (
        <GlobalContext.Consumer>
            {(context) => {
                if (context === undefined) {
                    throw new Error(
                        'GlobalContextConsumer must be used within a GlobalContextProvider',
                    );
                }
                return children(context);
            }}
        </GlobalContext.Consumer>
    );
}

// NOTE : This HOC can be used to pass Global context data to any  WrappedComponent.
export function withGlobalContext(WrappedComponent) {
    return (props) => {
        return (
            <GlobalContextConsumer>
                {(context) => {
                    const { contextState, contextActions } = context;

                    return (
                        <WrappedComponent
                            contextState={contextState}
                            contextActions={contextActions}
                            {...props}
                        />
                    );
                }}
            </GlobalContextConsumer>
        );
    };
}
