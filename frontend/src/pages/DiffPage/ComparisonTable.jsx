import { useState } from "react";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "../../components/Tabs/Tabs";
import Table from "./Table";

function ComparisonTable({ agreements, disagreements, selectedUsers }) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <Tabs defaultIndex={0}>
          <TabList>
            <Tab index={0} className="w-1/2">
              <div className="bg-green-100 p-4 hover:bg-green-200 transition-colors">
                <h3 className="font-semibold">Agreements</h3>
                <p>{selectedUsers && selectedUsers.length > 0 ? `${agreements.length} spans` : 'Select annotators'}</p>
              </div>
            </Tab>
            <Tab index={1} className="w-1/2">
              <div className="bg-yellow-100 p-4 hover:bg-yellow-200 transition-colors">
                <h3 className="font-semibold">Disagreements</h3>
                <p>{selectedUsers && selectedUsers.length > 0 ? `${disagreements.length} spans` : 'Select annotators'}</p>
              </div>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel index={0}>
              <Table 
                comparisons={agreements}
                users={selectedUsers}
                type="Agreement"
              />
            </TabPanel>
            <TabPanel index={1}>
              <Table 
                comparisons={disagreements}
                users={selectedUsers}
                type="Disagreement"
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    );
  }


export default ComparisonTable; 