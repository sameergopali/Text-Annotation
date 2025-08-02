import { useState, createContext, useContext } from "react";

const TabsContext = createContext();

const Tabs = ({ children, defaultIndex = 0 }) => {
    const [activeTab, setActiveTab] = useState(defaultIndex);

    const value = {
        activeTab,
        setActiveTab
    };

    return (
        <TabsContext.Provider value={value}>
                <div className="flex flex-col">
                    {children}
                </div>
        </TabsContext.Provider>
    );
};

const TabList = ({ children }) => {
    return (
        <div className="flex space-x-4">
            {children}
        </div>
    );
};

const Tab = ({ children, index, className }) => {
    const { activeTab, setActiveTab } = useContext(TabsContext);

    return (
        <div
            className={`cursor-pointer  ${className} ${activeTab === index ? 'bg-gray-200' : 'bg-gray-100'}`}
            onClick={() => setActiveTab(index)}
        >
            {children}
        </div>
    );
};

const TabPanels = ({ children }) => {
    return (
        <div className="flex flex-col mt-4 p-4 border rounded-lg ">
            {children}
        </div>
    );
};

const TabPanel = ({ children, index }) => {
    const { activeTab } = useContext(TabsContext);

    return (
        <div className={activeTab === index ? 'block' : 'hidden'}>
            {children}
        </div>
    );
};

export { Tabs, TabList, Tab, TabPanels, TabPanel };
