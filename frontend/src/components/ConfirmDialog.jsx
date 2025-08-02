
function ConfirmDialog({ isOpen, onClose, onSubmit, data, children }) {
    if (!isOpen) return null;
    
    return (
        <>
            <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
                <div className='bg-white p-6 rounded-lg shadow-lg  w-auto relative'>
                    <h3 className='text-2xl font-semibold mb-4 text-center'></h3>
                    {children}
                    <div className='flex justify-end space-x-4'>
                        <button onClick={onClose} className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'>Cancel</button>
                        <button onClick={() => { onSubmit && onSubmit(data); onClose(); }} className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'>OK</button>
                    </div>
                </div>
            </div>
        </>
    )


}
export default ConfirmDialog;