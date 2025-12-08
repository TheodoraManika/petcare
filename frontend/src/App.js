import './App.css';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import UserGroups from './components/UserGroups';
import Features from './components/Features';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navigation />
      <main className="main-content">
        <Hero />
        <UserGroups />
        <Features />
        <Footer />
      </main>
    </div>
  );
}

export default App;
