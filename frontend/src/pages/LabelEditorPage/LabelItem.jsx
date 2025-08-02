import {useState} from 'react';
import { ChevronRight, ChevronDown,Plus, X, Edit2, Save } from 'lucide-react';

const LabelItem = ({item, onDelete, onUpdate, level}) => {
    const [isExpanded, setIsExpanded] = useState(false);    
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(item.name)

    const handleSave=()=>{
        console.log('saving');
        onUpdate({...item, name: editName});
        setIsEditing(false);
    }
    const addSubLabel= ()=>{
        const newOptions = [...(item.options || []), {name: 'new label', "description":{"definition":"", "examples":[]},options: []}];
        onUpdate({...item, options: newOptions});
        setIsExpanded(true);
    }
    return (
        <div className="w-full">
        <div className="flex items-center gap-2 hover:bg-gray-50 p-2" style={{ paddingLeft: `${level * 24}px` }}>
            {item.options?.length > 0 ? <button onClick={()=>setIsExpanded(!isExpanded) } className="p-1">
                {isExpanded? <ChevronDown size={16}/> : <ChevronRight size={16}/>}</button>:<div className="w-6"/>
            }
            {!isEditing ? (
            <>
                <span className="flex-1">{item.name}</span>
                <button className="p-1 hover:text-green-600" title="Add sub-label" onClick={addSubLabel}><Plus/></button>
                <button className="p-1 hover:text-blue-600" onClick={()=>setIsEditing(true)}><Edit2/></button>
                <button  className="p-1 hover:text-red-600" onClick={()=>onDelete(item)}><X/></button> 
            </>
            ):
            (<>
                <input className="flex-1 border rounded px-2 py-1" type='text'  value={editName} onChange={(e)=>setEditName(e.target.value)}/>
                <button  className="p-1 hover:text-green-600" onClick={handleSave}><Save/></button>
            </>)
            }
        </div>
        
        {isExpanded && item.options?.map((option, index) => (
            <LabelItem item={option} key={index} 
                onDelete={(deleted)=>{
                    onUpdate({...item, options: item.options.filter((opt)=> opt !== deleted)});}}
                
                onUpdate={(updated)=>{
                    const newOptions = [...item.options];
                    newOptions[index] = updated;
                    onUpdate({...item, options: newOptions});
                }}
                level={level + 1}
            />
        ))}
        </div>
    )

}

export default LabelItem;