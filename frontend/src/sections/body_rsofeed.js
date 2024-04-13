import React from 'react';
import Cookies from 'universal-cookie';
const route = require('./route.js');

const RSOFeed = () => {
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
            return;
        }

        setResults(contents);
    }

    const trySearch = async event =>
    {
        event.preventDefault();

        var object = {search:search.value};
        var input = JSON.stringify(object);

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

    return (
        <div>
            <p>hello welcome</p>
            <div>RSO Feed</div>
            <div><form onSubmit={trySearch}>
                <input id="search" ref={(c) => search = c}/>
                <button>Search</button>
            </form></div><br/>
            <span id="result">{message}</span><br/>
            <ul id = "searchResults">
                {
                    results.map((result) => (
                        <li key={result.RSOID} id="searchResult">{result.Name}</li>
                    )
                )}
            </ul>
            
        </div>
    )

}

export default RSOFeed;