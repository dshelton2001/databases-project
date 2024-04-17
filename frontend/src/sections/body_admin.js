import React from 'react';
import './body_admin.css';
import Cookies from 'universal-cookie';
const route = require('./route.js');

const AdminBody = () => {
    const redirectHome = () => {
		window.location.href = "/home";
	}

    const redirectCreate = () => {
		window.location.href = "/admin/create";
	}

    const redirectManage = () => {
		window.location.href = "/admin/manage";
	}
    
    const checkForAdmin = async event =>
	{
		const cookies = new Cookies();
		var cookie = cookies.get('login');

		var object = { uid: cookie };
		var input = JSON.stringify(object);

		try
        {
            const response = await fetch(route.buildRoute('/api/users/checkadmin'), {
                method:'post',
                body: input,
                headers: {'Content-Type': 'application/json'}
            });

            var ret = JSON.parse(await response.text());

			if (!ret.isAdmin)
			{
				redirectHome();
			}
        }
        catch(e)
        {
            alert(e.toString());
            
            redirectHome();
        }
	}

    React.useEffect(() => {
		return () => {
			checkForAdmin();
		};
	},[]);

    return (
        <div class="trueBody">
            <div class="menuText">Manage Menu</div>

            <div class="adminOption">< button onClick={redirectManage} class="optionButton">Managed RSO's</button></div>
            <div class="adminOption"><button onClick={redirectCreate} class="optionButton">Create RSO</button></div>
        </div>
    )
}

export default AdminBody;