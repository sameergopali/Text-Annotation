import Card from "../../components/Card";
import { Tab,Tabs,TabList, TabPanel, TabPanels } from "../../components/Tabs/Tabs";
import { FilterOptions } from "./FilterOptions";
import TextSegment from "./Segments";

function DiffCard({ text, segments, filter, handleFilterChange }) {
    return (
        <Card title="Test Card" className="mt-4">
            <Tabs defaultIndex={0}>
              <TabList>
                <Tab index={0}>Tab 1</Tab>
                <Tab index={1}>Tab 2</Tab>
                <Tab index={2}>Tab 3</Tab>
              </TabList>
              <TabPanels>
                <TabPanel index={0}>
                    <FilterOptions filter={filter} handleFilterChange={handleFilterChange}/>
                    <TextSegment text={text} segments={segments} filter={filter} />
                </TabPanel>
                <TabPanel index={1}>
                    Panel 2
                </TabPanel>
                <TabPanel index={2}>
                    Panel 3
                </TabPanel>
              </TabPanels>
            </Tabs>
            </Card>
    )
}

export default DiffCard;    