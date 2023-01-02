import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

// Provider, Consumer - GithubContext.Provider

const GithubProvider = ({children}) =>{
    const [githubUser, setGithubUser] = useState(mockUser);
    const [repos, setRepos] = useState(mockRepos);
    const [followers, setFollwers] = useState(mockFollowers);

    //request loadinf
    const [requests, setRequests] = useState(0);
    const [loading, setIsLoading]= useState(false);
    //erro
    const [error, setError] = useState({show:false, msg: ""})
    

    const searchGithubUser = async(user) => {
        const response = await (await axios(`${rootUrl}/users/${user}`)).
        catch(err => console.log(err))
        if(response){
            setGithubUser(response.data)
        }else {
            toggleError(true, 'there is no user that username');
        }
    }
    
    
    //check rate
    const checkRequests = () =>{
        axios(`${rootUrl}/rate_limit`).then(({data}) =>{
            let {rate: {remaining}} = data;
            setRequests(remaining);
            if(remaining === 0){
                toggleError(true, 'sorry you have exceeded your hourly rate limit')
            }

        }).catch((err) => console.log(err))
    }
    function toggleError(show = false, msg = ''){
        setError({show,msg});
    }
    //error


    useEffect(() =>{
        checkRequests()
    },[])
    return (
        <GithubContext.Provider value={{
            githubUser,
            repos,
            followers,
            requests,
            error,
            searchGithubUser
        }}>{children}</GithubContext.Provider>
    )
}

export{GithubProvider, GithubContext};