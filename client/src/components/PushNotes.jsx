//https://github.com/u4aew/react-pwa-push-notifications/blob/main/demo/client/src/App.tsx#L93

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import './App.css';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import axios from "axios";
import useSubscribe from '../hooks/utility/useSubscribe'

function PushNotes() {
    const [loadingSubscribe, setLoadingSubscribe] = useState<boolean>(false)
    const [loadingPush, setLoadingPush] = useState<boolean>(false)
    const [pushId, setPushId] = useState<string>('');
    const [message, setMessage] = useState<string>('World');
    const [title, setTitle] = useState<string>('Hello');
    const [subscribeId, setSubscribeId] = useState<string>('');
    const [showSubscribe, setShowSubscribe] = useState<boolean>(true)
    const PUBLIC_VAPID_KEY = config.PUBLIC_VAPID_KEY
    const { getSubscription } = useSubscribe({publicKey: PUBLIC_VAPID_KEY});
    
    const onShowSubscribe = () => {
        setShowSubscribe(true)
    }
    const onShowPush = () => {
        setShowSubscribe(false)
    }



    useEffect(() => {
        FingerprintJS.load()
            .then(fp => fp.get())
            .then(result => {
                setSubscribeId(result.visitorId)
                setPushId(result.visitorId)
            });
    }, []);


const onSubmitSubscribe = async (e) => {
    try {
        // Get the subscription object using the getSubscription function
        const subscription = await getSubscription();

        // Send the subscription object and ID to the server for registration
        await axios({
            axiosInstance: axios,
            method: "POST",
            url:"'s/push/subscribe'",
            headers: {
                "authorization": authHeader()
            }, 
            data: {
              subscription: subscription,
              id: subscribeId
          }
          });

        // Log a message in case of successful subscription
        console.log('Subscribe success');
    } catch (e) {
        // Log a warning in case of an error
        console.warn(e);
    }
}}