import { useState } from "react";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "../../components/Tabs/Tabs";
import Table from "./Table";

function ComparisonTable({ agreements, disagreements }) {
    console.log('disagreements', disagreements);
    return (
         <>
            <Tabs defaultIndex={0}>
                <TabList >
                    <Tab index={0}>
                        <div className="bg-green-100  p-4">
                        <h3 className="font-semibold ">Agreements</h3>
                        <p> {agreements.length} spans</p>
                        </div>
                    </Tab>
                    <Tab index={1}>
                        <div className="bg-yellow-100  p-4 ">
                        <h3 className="font-semibold">Disagreements</h3>
                        <p>{disagreements.length} spans</p>
                        </div>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel index={0}>
                        <Table comparisons={agreements} />
                    </TabPanel>
                    <TabPanel index={1}>
                        <Table comparisons={disagreements} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    );
}


export default ComparisonTable;