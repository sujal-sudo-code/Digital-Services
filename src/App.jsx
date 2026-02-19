import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import SoftBackdrop from './components/SoftBackdrop';
import Footer from './components/Footer';
import LenisScroll from './components/LenisScroll';

function App() {
	return (
		<Router>
			<SoftBackdrop />
			<LenisScroll />
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/admin" element={<Admin />} />
			</Routes>
			<Footer />
		</Router>
	);
}
export default App;
