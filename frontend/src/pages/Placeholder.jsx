import ConfirmDialog from "../components/ConfirmDialog";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "../components/Tabs/Tabs";
import { useDialog } from "../hooks/useDialog";

const Placeholder = () => { 
  const { isOpen,openDialog, closeDialog,dialogData, } = useDialog();

  return (
    <>
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h2 className="text-blue-500 text-4xl mb-4">Welcome to the Placeholder Page</h2>
        <p className="text-gray-700 text-lg">This is a placeholder page. More content will be added soon.</p>
        <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={() => openDialog({ title: "Learn More", message: "This is a placeholder page. More content will be added soon." })}>
          Learn More
        </button>
        <Tabs defaultIndex={0}>
          <TabList>
            <Tab index={0}>Tab 1</Tab>
            <Tab index={1}>Tab 2</Tab>
            <Tab index={2}>Tab 3</Tab>
          </TabList>
          <TabPanels>
            <TabPanel index={0}>Panel 1</TabPanel>
            <TabPanel index={1}>Panel 2</TabPanel>
            <TabPanel index={2}>Panel 3</TabPanel>
          </TabPanels>
        </Tabs>
      </div>
      <ConfirmDialog isOpen={isOpen} onClose={closeDialog}  data={dialogData} >
        <h3>Test Diaolog</h3>
      </ConfirmDialog  >
      
      
    </div>
    
    </>
  );
}

export default Placeholder;