import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from './pages/index';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';

import RSOSearch from './pages/rso_search';
import RSOView from './pages/rso_view';
import RSOMine from './pages/rso_mine';

import EventView from './pages/event_view';
import EventSearch from './pages/event_search';

import Admin from './pages/admin';
import AdminCreate from './pages/admin_create';
import AdminManage from './pages/admin_manage';
import AdminRSOEdit from './pages/admin_rso_edit';

function App ()
{
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Index />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/home" element={<Home />} />

				<Route path="/rso/search" element={<RSOSearch />} />
				<Route path="/rso/view" element={<RSOView />} />
				<Route path="/rso/acct" element={<RSOMine />} />

				<Route path="/event/view" element={<EventView />} />
				<Route path="/event" element={<EventSearch />} />

				<Route path="/admin" element={<Admin />} />
				<Route path="/admin/create" element={<AdminCreate />} />
				<Route path="/admin/manage" element={<AdminManage />} />
				<Route path="/admin/managerso" element={<AdminRSOEdit />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;