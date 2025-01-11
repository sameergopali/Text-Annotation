import { useState, createContext, useContext} from "react";

const TabsContext = createContext();  

const Tabs = ({children, defaultIndex = 0}) => {

    const [activeTab, setActiveTab] = useState(defaultIndex);

    const value = {
        activeTab,
        setActiveTab
    }

    return (
        <TabsContext.Provider value={value}>
            <div className="flex flex-col">
                <div className="flex">
                    {children}
                </div>
            </div>
        </TabsContext.Provider>
    );
}

const TabList = ({children}) => {
    return (
        <div className="flex">
            {children}
        </div>
    );
}

const Tab = ({children, index}) => {    
    const {activeTab, setActiveTab} = useContext(TabsContext);

    return (
        <div 
            className={`cursor-pointer px-4 py-2 ${activeTab === index ? 'bg-gray-200' : 'bg-gray-100'}`}
            onClick={() => setActiveTab(index)}
        >
            {children}
        </div>
    );
}

const TabPanels = ({children}) => {
    return (
        <div>
            {children}
        </div>
    );
}
const TabPanel = ({children, index}) => {   
    const {activeTab} = useContext(TabsContext);

    return (
        <div className={activeTab === index ? 'block' : 'hidden'}>
            {children}
        </div>
    );

}

export {Tabs, TabList, Tab, TabPanels, TabPanel};   