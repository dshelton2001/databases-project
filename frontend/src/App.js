import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from './pages/index';
import Login from './pages/login';
import Register from './pages/register';
import RSOFeed from './pages/rsofeed';
import RSOView from './pages/rsoview';
import EventView from './pages/eventview';
import Admin from './pages/admin';
import AdminCreate from './pages/admin_create';
import AdminManage from './pages/admin_manage';

function App ()
{
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Index />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				<Route path="/home" element={<RSOFeed />} />
				<Route path="/viewrso" element={<RSOView />} />
				<Route path="/viewevent" element={<EventView />} />

				<Route path="/admin" element={<Admin />} />
				<Route path="/admin/create" element={<AdminCreate />} />
				<Route path="/admin/manage" element={<AdminManage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;