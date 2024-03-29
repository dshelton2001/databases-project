import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import Index from './pages/index';
import Login from './pages/login';

function App ()
{
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Index />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
