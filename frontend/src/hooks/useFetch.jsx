import { useState, useEffect, useCallback } from "react";
import { use } from "react";
import axios from "axios";

const useFetch = ({ 
    url,
    onSuccess = null,
    queryparams={}, 
    options={}, 
    dependencies = [],
    fetchOnMount = true
    }) => {
        const [data, setData] = useState(null);
        const [error, setError] = useState(null);
        const [loading, setLoading] = useState(false);

        const fetchData = async (queryparams) => {
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
                console.log('fetching data', modifiedUrl);
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
        
        if (fetchOnMount) {
            useEffect(() => {
                    fetchData(queryparams);
                }, [...dependencies]);
        }
            

        return { data, error, loading, refetch: fetchData };
        };


const usePost = ({url}) => { 
    console.log('usePost', url);

    const [success, setSuccess] = useState(null); 
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const reset = () => {   
        setSuccess(null);
        setError(null);
        setLoading(false);
    }
    const postData = async ({body, options={}, onSuccess}) => {
        try {
            setLoading(true);
            console.log('posting data,',url);
            let token = localStorage.getItem('token');
            let result = await axios.post(url, body, {
                headers: {
                'Authorization': `Bearer ${token}`,
                ...options.headers
                }
            });
            setSuccess(result.data);
        } catch (err) {
            setError(err);
            console.log(err);
        } finally {
            setLoading(false);  
            console.log('done');
        }
    };

    return {loading, error , success,reset, postData };
}
export { usePost, useFetch };
