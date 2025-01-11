import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useFetch = ({ 
    url,
    onSuccess = null,
    queryparams={}, 
    body = null,
    options={}, 
    dependencies = []
    }) => {
        const [data, setData] = useState(null);
        const [error, setError] = useState(null);
        const [loading, setLoading] = useState(false);

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log('fetching data');
                let token = localStorage.getItem('token');

                let headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json", // Add Content-Type header for POST
                    ...options.headers, // Merge custom headers
                  };
                let modifiedUrl = url;
                if (queryparams) {
                    modifiedUrl += '?' + new URLSearchParams(queryparams).toString();
                }

                const fetchOptions = {
                    headers
                  };

                let result = await fetch(modifiedUrl, fetchOptions);
                result = await result.json();
                console.log(result);
                setData(result);
                if (onSuccess) onSuccess(result); // Optional callback for additional handling
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            fetchData();
            
        }, [...dependencies]);

        return { data, error, loading, refetch: fetchData };
        };


const usePost = ({url}) => { 
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const postData = async ({body}) => {
        try {
            setLoading(true);
            let token = localStorage.getItem('token');
            let result = await axios.post('http://localhost:8000/labels', body, {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            });
            setData(result);
        } catch (err) {
            setError(err);
            console.log(err);
        } finally {
            setLoading(false);  
            console.log('done');
        }
    };

    return {loading, data, error ,postData };
}
export { usePost, useFetch };
