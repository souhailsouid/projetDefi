import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="aap">
      <Header />
      <main className="main">
        {children}
        <Footer />
      </main>
    </div>
  );
};

export default Layout;
