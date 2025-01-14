import { useState } from "react";

import Toast from "../../components/Toast";
import { usePost } from "../../hooks/useFetch";

function Import() {
    const [file, setFile] = useState(null);
    const { loading, error, success,reset, postData } = usePost({ url: 'http://localhost:8000/import' });
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        console.log(event.target.files[0]);
        setFile(event.target.files[0]);
        setMessage('');
    };

    const handleSubmit = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            console.log('file', file);
            console.log('formData', formData);
            const options = {
                headers: {
                    'Content-Type': 'multipart/form-data', // Let Axios set this automatically
                }
            };

            await postData({ body: formData, options: options });
        } else {
            console.error('No file selected');
            setMessage('No file selected.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    className="mb-4 p-2 border border-gray-300 rounded"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                    Submit
                </button>
                {loading && <p>Uploading...</p>}
                {error && <Toast message="Error uploading" reset={reset} duration={1000}/>}
                {success && <Toast message="File Uploaded Successfully!" duration={1000} reset={reset}/>}
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default Import;