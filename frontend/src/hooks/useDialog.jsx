import { useState, createContext } from 'react';


    

export function useDialog(initialState = false) {
    const [isOpen, setIsOpen] = useState(initialState);
    const [dialogData, setData] = useState(null);
    
    const openDialog = (data=null)=>{ 
        setDialogData(data);
        setIsOpen(true);
    }

    const closeDialog =  (data=null)=>{ 
        setDialogData(null);
        setIsOpen(false);
    }
    const setDialogData = (data) => {
        setData(prevData => ({ ...prevData, ...data }));
    }

    return { isOpen, openDialog, closeDialog, dialogData, setDialogData };
}
