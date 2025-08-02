import AnnotatedText from "../../components/AnnotatedText";
import Card from "../../components/Card";
import { Tabs, Tab, TabList, TabPanel, TabPanels } from "../../components/Tabs/Tabs";
import { FilterOptions } from "./FilterOptions";
import TextSegment from "./Segments";

function DiffCard({ text, segments, filter, handleFilterChange, selectedUsers }) {
  const getLabels = (user) => {
    const seen = new Set();
    const labelMap = new Map(); // Using Map to preserve insertion order

    // Single pass through all segments
    for (const segment of segments) {
        for (const label of segment.labels) {
            if (label.user === user) {
                // Create composite key for uniqueness check
                const key = `${label.start}|${label.end}|${label.codes.join(',')}`;
                
                if (!seen.has(key)) {
                    seen.add(key);
                    // Store in Map using start position as key for efficient sorting
                    labelMap.set(label.start, {
                        start: label.start,
                        end: label.end,
                        codes: label.codes,
                        text: label.text
                    });
                }
            }
        }
    }

    // Convert Map values to array and sort
    const sortedLabels = Array.from(labelMap.values()).sort((a, b) => 
        a.start - b.start || a.end - b.end
    );

    return sortedLabels;
};

    return (
        <Card>
            <Tabs defaultIndex={0}>
                <TabList>
                    <Tab className='px-4 py-2' index={0}>Combined View</Tab>
                    {selectedUsers.map((user, index) => (
                        <Tab key={user} className='px-4 py-2' index={index + 1}>
                            {user}'s Annotations
                        </Tab>
                    ))}
                </TabList>
                <TabPanels>
                    <TabPanel index={0}>
                        <FilterOptions filter={filter} handleFilterChange={handleFilterChange} />
                        <TextSegment text={text} segments={segments} filter={filter} />
                    </TabPanel>
                    {selectedUsers.map((user, index) => (
                        <TabPanel key={user} index={index + 1}>
                             <AnnotatedText text={text}  annotations={getLabels(user)} />
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
        </Card>
    );
}

export default DiffCard;