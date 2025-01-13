import { useState } from "react";
import { use } from "react";
import { useParams } from "react-router";

import { Tabs, TabList, Tab, TabPanels, TabPanel } from "../../components/Tabs/Tabs";
import TopPanel from "../../components/TopPanel"
import UserComparisonSelector from "../../components/UserSelector"
import { useFetch } from "../../hooks/useFetch";
import DiffCard from "./CardDiff";
import ComparisonTable from "./ComparisonTable";
import { useFilter } from "./FilterOptions";
import MatchingStratgeySelector from "./MatchingStrategySelector";

function DiffTool(){
    const params = useParams();
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [curr, setCurr] = useState(0);
    const [user1, setUser1] = useState(null);
    const [user2, setUser2] = useState(null);
    const [text, setText] = useState("");
    const [agreements, setagreements] = useState([]);
    const [disagreements, setdisagreements] = useState([]);
    const [segments, setSegments] = useState([]);   
    const {filter, handleFilterChange} = useFilter();
    const [matchingCriteria, setMatchingCriteria] = useState('exact');

    useFetch({
        url:"http://localhost:8000/total/",
        queryparams:{folder:params.folder},
        dependencies: [curr],
        onSuccess: (data) => setTotal(data.total)
    });

    useFetch({
        url:"http://localhost:8000/users/",
        queryparams:{folder:params.folder},
        dependencies: [curr],
        onSuccess: (data) => setUsers(data.users)
    });

    useFetch({
        url:"http://localhost:8000/segments/",
        queryparams:{folder:params.folder, users:[user1,user2], curr:curr, matchingCriteria:matchingCriteria},
        dependencies: [user1, user2, curr, matchingCriteria],
        onSuccess: (data) => {
            console.log('labels', data.segments)
            setSegments(data.segments)  
        }
    });

    useFetch({
        url:"http://localhost:8000/agreements/",
        queryparams:{folder:params.folder, users:[user1,user2], curr:curr, matchingCriteria:matchingCriteria},
        dependencies: [user1, user2, curr, matchingCriteria],
        onSuccess: (data) => {
            console.log('agreements', data.agreements )
            setagreements(data.agreements)  
        }
    });

    useFetch({
        url:"http://localhost:8000/disagreements/",
        queryparams:{folder:params.folder, users:[user1,user2], curr:curr, matchingCriteria:matchingCriteria},
        dependencies: [user1, user2, curr, matchingCriteria],
        onSuccess: (data) => {
            console.log('labels', data.disagreements)
            setdisagreements(data.disagreements)  
        }
    });


    useFetch({
        url:"http://localhost:8000/text/",
        queryparams:{folder:params.folder, curr: curr},
        dependencies: [curr],
        onSuccess: (data) => setText(data.text)
    });

    const criterias = [ 'exact', 'Jaccard'];
    return(
       <>
          <TopPanel total={total} onChange={setCurr}>
                <span className="mx-4">|</span>
                <UserComparisonSelector 
                    users={users} 
                    setUser1={(u1)=>setUser1(u1)}
                    setUser2={(u2)=>setUser2(u2)}
                />
                
                <span className="mx-4">|</span>
                <MatchingStratgeySelector 
                    criterias={criterias}
                    setMatchingCriteria={setMatchingCriteria}
                />
             
            </TopPanel>
            <Tabs defaultIndex={0}>
                <TabList >
                    <Tab index={0}>Text View</Tab>
                    <Tab index={1}>Comparison Table</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel index={0}>
                        <DiffCard text={text} segments={segments} filter={filter} handleFilterChange={handleFilterChange}/>
                    </TabPanel>
                    <TabPanel index={1}>
                        <ComparisonTable agreements={agreements} disagreements={disagreements} /> 
                    </TabPanel>
                </TabPanels>
            </Tabs>
            
       </>
    )
}

export default DiffTool;