import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import Header from './Header';
// import Footer from './Footer';
import { useSearchStore } from '../store/search';
import SearchResults from '../pages/SearchResults';

const Layout = () => {

    const search = useSearchStore((state) => state.search);

    return (
        <section>
            <Toaster />
            <Header />
            <section className="min-h-[1000px] bg-white dark:bg-gray-900">
                {
                    search !== '' ? (
                        <SearchResults />
                    ) : (
                        <Outlet />
                    )
                }
            </section>
            {/* <Footer /> */}
        </section>
    )
}

export default Layout