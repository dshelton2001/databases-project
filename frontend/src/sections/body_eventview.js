import React from 'react';
import Cookies from 'universal-cookie';
import './body_rsoview.css';
var url = require('url');
const route = require('./route.js');
const fakeEventCount = 20;
const faking = true;

const RSOViewBody = () => {
    var rsoid;
    const [message, setMessage] = React.useState('');
    const [result, setResult] = React.useState({});
    const [comments, setComments] = React.useState([]);

    const fillData = (contents) =>
    {
        if (!contents || contents === null)
        {
            var fakeRSO = {
                Name: "HAHAHA THE ULTIMATE EVENT",
                Description: "IT IS I, THE ULTIMATE EVENT!!!! Please, go ahead and do the thing :)",
                Time: formatDate(new Date())
            }

            setResult(fakeRSO);

            var fakeComments = [];

            for (let i = 0; i < fakeEventCount; i++)
            {
                var faker = {
                    Name: "Bot001",
                    Comment: formatDate(new Date()) + " - Wow this looks fun!",
                };

                fakeComments.push(faker);
            }

            setComments(fakeComments);

            return;
        }
    }

    const formatDate = (date) =>
    {
        return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    }

    const redirectEvent = (EventID) =>
    {
        window.location = "/viewevent?eventid=" + EventID;
    }

    React.useEffect(() => {
        return () => {
            if (faking)
            {
                fillData(null);
            }
        };
	},[]);

    return (
        <div class = "trueBody">
            <div id="profile">
                <h1 class="title">{result.Name}</h1><a id="member"> - <bold>{result.Time}</bold></a><br/>
                <p class="mainDesc">{result.Description}</p>
            </div>
            <b id="activity"></b>
            <h2 id="lessPadding">Comments</h2>
            <div id="searchResults">
            {
                comments.map((comment) => (
                    <div id="searchResult">
                        <div id="name">
                            {comment.Name}
                        </div>
                        <div id="shellDesc">
                            <div id="desc">
                                {comment.Comment}
                            </div>
                        </div>
                    </div>
                ))
            }
            </div>
        </div>
    )
}

export default RSOViewBody;