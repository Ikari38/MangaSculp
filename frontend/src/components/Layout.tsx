import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {

    return (
        <section>
            <Toaster />
            <Header />
            <section className="min-h-[1000px] bg-white dark:bg-gray-900">
                <Outlet />
            </section>
            {/* <Footer /> */}
        </section>
    )
}

export default Layout