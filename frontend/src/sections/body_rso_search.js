import React from 'react';
import Cookies from 'universal-cookie';
import './body_rso_search.css';
const route = require('./route.js');
const fakeDataCount = 100;
const faking = false;

const RSOSearch = () => {
    var search;

    const [message, setMessage] = React.useState('');
    const [results, setResults] = React.useState([]);
    
    const emptyTable = () =>
    {
        setResults([]);
    }

    const fillTable = (contents) =>
    {
        // going to fill with fake data here
        if (!contents)
        {
            var fakeData = [];

            for (let i = 0; i < fakeDataCount; i++)
            {
                var faker = {
                    Name: "The Ultimate Bot Group",
                    Description: "The bots have taken over",
                    RSOID: 69
                };

                fakeData.push(faker);
            }

            setResults(fakeData);
            setMessage("Loaded real data!");
            
            return;
        }

        setResults(contents);
    }

    const trySearch = async event =>
    {
        event.preventDefault();

        var object = {search:search.value};
        var input = JSON.stringify(object);

        if (faking)
        {
            fillTable()
            return;
        }

        try
        {
            const response = await fetch(route.buildRoute('/api/rso/search'), {
                method:'post',
                body: input,
                headers: {'Content-Type': 'application/json'}
            });

            var ret = JSON.parse(await response.text());
            setMessage(ret.message);

            emptyTable();

            if (ret.results && ret.results.length > 0)
                fillTable(ret.results);
        }
        catch(e)
        {
            alert(e.toString());
            
            return false;
        }

        return true;
    }

    const pizazzName = (name) =>
    {
        if (!name || typeof name != "string")
            name = "A Really Cool RSO";

        return name;
    }

    const pizazzDesc = (desc) =>
    {
        
        if (!desc || typeof desc != "string")
            desc = "Check us out!";

        return desc;
    }

    // to-do: use cookie to check for permissions
    // or maybe do it when the rSO loads
    const redirectRSO = (RSOID) =>
    {
        window.location = "/rso/view?rsoid=" + RSOID;
    }

    return (
        <div class = "trueBody">
            <div class="menuText">RSO Search</div>
            <form onSubmit={trySearch}>
                <div id="searchBar">
                    <input id="search" ref={(c) => search = c}/>
                </div>
                <div id="searchButton">
                    <button id="sbutton">Search</button>
                </div>
            </form><br/>
            <p id="result">{message}</p>
            <div id = "searchResults">
                {
                    results.map((result) => (
                        <div id="searchResult">
                            <div id="name" onClick={() => redirectRSO(result.RSOID)}>
                                {pizazzName(result.Name)}
                            </div>
                            <div id="shellDesc">
                                <div id="desc">
                                    {pizazzDesc(result.Description)}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            
        </div>
    )

}

export default RSOSearch;