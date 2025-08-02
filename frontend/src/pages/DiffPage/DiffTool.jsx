import { useState } from "react";
import { useParams } from "react-router";

import { Tabs, TabList, Tab, TabPanels, TabPanel } from "../../components/Tabs/Tabs";
import TopPanel from "../../components/TopPanel";
import { useFetch } from "../../hooks/useFetch";
import { featureFlags } from "../../hooks/useFlags";
import DiffCard from "./CardDiff";
import ComparisonTable from "./ComparisonTable";
import { useFilter } from "./FilterOptions";
import MatchingStratgeySelector from "./MatchingStrategySelector";

function DiffTool() {
    const params = useParams();
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [curr, setCurr] = useState(0);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [text, setText] = useState("");
    const [agreements, setAgreements] = useState([]);
    const [disagreements, setDisagreements] = useState([]);
    const [segments, setSegments] = useState([]);   
    const { filter, handleFilterChange } = useFilter();
    const [matchingCriteria, setMatchingCriteria] = useState('exact');

    useFetch({
        url: "http://localhost:8000/total/",
        queryparams: { folder: params.folder },
        dependencies: [curr],
        onSuccess: (data) => setTotal(data.total)
    });

    useFetch({
        url: "http://localhost:8000/users/",
        queryparams: { folder: params.folder },
        dependencies: [curr],
        onSuccess: (data) => setUsers(data.users)
    });

    useFetch({
        url: "http://localhost:8000/segments/",
        queryparams: { folder: params.folder, users: selectedUsers, curr: curr, matchingCriteria: matchingCriteria },
        dependencies: [selectedUsers, curr, matchingCriteria],
        onSuccess: (data) => {
            console.log('segments', data.segments);
            setSegments(data.segments);
        }
    });

    useFetch({
        url: "http://localhost:8000/agreements/",
        queryparams: { folder: params.folder, users: selectedUsers, curr: curr, matchingCriteria: matchingCriteria },
        dependencies: [selectedUsers, curr, matchingCriteria],
        onSuccess: (data) => {
            console.log('agreements', data.agreements);
            setAgreements(data.agreements);
        }
    });

    useFetch({
        url: "http://localhost:8000/disagreements/",
        queryparams: { folder: params.folder, users: selectedUsers, curr: curr, matchingCriteria: matchingCriteria },
        dependencies: [selectedUsers, curr, matchingCriteria],
        onSuccess: (data) => {
            console.log('disagreements', data.disagreements);
            setDisagreements(data.disagreements);
        }
    });

    useFetch({
        url: "http://localhost:8000/text/",
        queryparams: { folder: params.folder, curr: curr },
        dependencies: [curr],
        onSuccess: (data) => setText(data.text)
    });

    const handleUserToggle = (user) => {
        setSelectedUsers(prev => 
            prev.includes(user)
                ? prev.filter(u => u !== user)
                : [...prev, user]
        );
    };

    const criterias = ['exact', 'Jaccard'];
    
    return (
        <>
            <TopPanel total={total} onChange={setCurr}>
                <div className="flex items-center gap-4 ml-4">
                    <span className="font-medium">Annotators:</span>
                    <div className="flex gap-4">
                        {users.map(user => (
                            <label key={user} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user)}
                                    onChange={() => handleUserToggle(user)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>{user}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </TopPanel>

            <Tabs defaultIndex={0}>
                <TabList>
                    <Tab className={`px-6 py-3 -mb-px font-medium text-sm rounded-t-lg border transition-colors duration-200` } index={0}>Text View</Tab>
                    <Tab className={`px-6 py-3 -mb-px font-medium text-sm rounded-t-lg border transition-colors duration-200` } index={1}>Comparison Table</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel index={0}>
                        <DiffCard 
                            text={text} 
                            segments={segments} 
                            filter={filter} 
                            handleFilterChange={handleFilterChange}
                            selectedUsers={selectedUsers}
                        />
                    </TabPanel>
                    <TabPanel index={1}>
                        <ComparisonTable 
                            agreements={agreements} 
                            disagreements={disagreements} 
                            selectedUsers={selectedUsers}
                        /> 
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    );
}

export default DiffTool;