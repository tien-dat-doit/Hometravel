import { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { IRootState } from '../../store';
import { toggleSidebar } from '../../store/themeConfigSlice';
import IconCaretDown from '../Icon/IconCaretDown';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconZipFile from '../Icon/IconZipFile';
import IconHome from '../Icon/IconHome';
import IconListCheck from '../Icon/IconListCheck';
import IconMinus from '../Icon/IconMinus';
import IconPencil from '../Icon/IconPencil';
import IconMenuChat from '../Icon/Menu/IconMenuChat';
import IconUser from '../Icon/IconUser';
import IconPrinter from '../Icon/IconPrinter';
import IconMenuWidgets from '../Icon/Menu/IconMenuWidgets';
import IconMenuCharts from '../Icon/Menu/IconMenuCharts';
import IconMenuFontIcons from '../Icon/Menu/IconMenuFontIcons';
import IconMenuDragAndDrop from '../Icon/Menu/IconMenuDragAndDrop';
import IconMenuForms from '../Icon/Menu/IconMenuForms';
import IconNotesEdit from '../Icon/IconNotesEdit';
import IconServer from '../Icon/IconServer';
import IconDollarSignCircle from '../Icon/IconDollarSignCircle';
import useAuth from '../../hook/useAuth';
import IconChartSquare from '../Icon/IconChartSquare';
import IconChatDots from '../Icon/IconChatDots';
const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector(
        (state: IRootState) => state.themeConfig.semidark,
    );
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };
    const { auth, setAuth }: any = useAuth();
    useEffect(() => {
        const selector = document.querySelector(
            '.sidebar ul a[href="' + window.location.pathname + '"]',
        );
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any =
                    ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [location]);
    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-4 py-3">
                        <NavLink
                            to="/"
                            className="main-logo flex shrink-0 items-center"
                        >
                            <img
                                className="ml-[5px] w-8 flex-none"
                                src="/assets/images/auth/logo-notext.png"
                                alt="logo"
                            />
                            <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">
                                {t('HOMETRAVEL')}
                            </span>
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                    {/* sidebar owner*/}
                    {auth?.user?.role === "Owner" && ( 
                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
                            <li className="menu nav-item">
                                <NavLink
                                    type="button"
                                    className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`}
                                    to="/"
                                >
                                    <div className="flex items-center">
                                        <IconServer className="shrink-0 group-hover:!text-primary" />
                                        <span className="font-extrabold text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {t('Bảng Thống Kê')}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>

                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('HOMESTAY')}</span>
                            </h2>

                            <li className="nav-item">
                                <ul>
                                    <li className="nav-item">
                                        <NavLink
                                            to="/viewaddhomestay"
                                            className="group"
                                        >
                                            <div className="flex items-center">
                                                <IconHome className="shrink-0 group-hover:!text-primary" />
                                                <span className="font-semibold text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                    {t('Quản Lý Homestay')}
                                                </span>
                                            </div>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            to="/listhomestay"
                                            className="group"
                                        >
                                            <div className="flex items-center">
                                                <IconNotesEdit className="shrink-0 group-hover:!text-primary" />
                                                <span className="font-semibold text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                    {t('Danh Sách Homestay')}
                                                </span>
                                            </div>
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>

                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <IconMinus className="hidden h-5 w-4 flex-none" />
                                <span>{t('Quản Lý Đặt Phòng')}</span>
                            </h2>
                            <li className="menu nav-item">
                                <NavLink
                                    to="/roomlistbooking"
                                    className="group"
                                >
                                    <div className="flex items-center">
                                        <IconPencil className="shrink-0 group-hover:!text-primary" />
                                        <span className="font-semibold text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {t('Thông Tin Đặt Phòng')}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>

                            <li className="menu nav-item">
                                <NavLink to="/guestlist" className="group">
                                    <div className="flex items-center">
                                        <IconListCheck className="shrink-0 group-hover:!text-primary" />
                                        <span className="font-semibbold text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {t('Danh Sách Booking')}
                                        </span>
                                    </div>
                                </NavLink>

                            </li>                          
                            <li className="menu nav-item">
                                <NavLink to="/chat" className="group">
                                    <div className="flex items-center">
                                        <IconChatDots className="shrink-0 group-hover:!text-primary" />
                                        <span className="font-semibbold text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {t('Chat')}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                        
                    )}
                            {/* sidebar admin */}
                        {auth?.user?.role === "Admin" && ( 
                            <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
                            <li className="menu nav-item">
                                <NavLink
                                    type="button"
                                    className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`}
                                    to="/"
                                >
                                <div className="flex items-center">
                                        <IconServer className="shrink-0 group-hover:!text-primary" />
                                        <span className="font-extrabold text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {t('Thống kê Hàng Ngày')}
                                        </span>
                                </div>
                            </NavLink>
                            </li>
                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <span>{t('HOMESTAY')}</span>
                            </h2>
                            <li className="menu nav-item">
                                <NavLink to="/managehomestay" className="group">
                                    <div className="flex items-center">
                                        <IconHome className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {t('Quản lý Homestay')}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>

                            <li className="menu nav-item">
                                <button
                                    type="button"
                                    className={`${currentMenu === 'datalabel' ? 'active' : ''} nav-link group w-full`}
                                    onClick={() => toggleMenu('datalabel')}
                                >
                                    <div className="flex items-center">
                                        <IconMenuForms className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {t('Cài đặt Homestay')}
                                        </span>
                                    </div>

                                    <div
                                        className={
                                            currentMenu !== 'datalabel'
                                                ? '-rotate-90 rtl:rotate-90'
                                                : ''
                                        }
                                    >
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight
                                    duration={300}
                                    height={
                                        currentMenu === 'datalabel' ? 'auto' : 0
                                    }
                                >
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/manageamenity">
                                                {t('Quản lý tiện ích')}
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/managepolicy">
                                                {t('Quản lý chính sách')}
                                            </NavLink>
                                        </li>
                                        
                                    </ul>
                                </AnimateHeight>
                            </li>
                            <li className="menu nav-item">
                                <NavLink to="/listoffeedback" className="group">
                                    <div className="flex items-center">
                                        <IconPencil className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {t('Quản lý Đánh giá')}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>
                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <span>{t('QUẢN LÝ ĐƠN HÀNG')}</span>
                            </h2>
                            <li className="menu nav-item">
                                <NavLink to="/managebooking" className="group">
                                    <div className="flex items-center">
                                        <IconZipFile className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {t('Danh sách đặt phòng')}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>
                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <span>{t('HỆ THỐNG')}</span>
                            </h2>
                            <li className="menu nav-item">
                                <NavLink to="/transaction" className="group">
                                    <div className="flex items-center">
                                        <IconDollarSignCircle className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {t('Ví tiền')}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="menu nav-item">
                                <NavLink to="/statistic" className="group">
                                    <div className="flex items-center">
                                        <IconChartSquare className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {t('Thống kê')}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="menu nav-item">
                                <NavLink to="/listusers" className="group">
                                    <div className="flex items-center">
                                        <IconUser className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {t('Quản lý người dùng')}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="menu nav-item">
                                <NavLink to="/managecontract" className="group">
                                    <div className="flex items-center">
                                        <IconPrinter className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {t('Quản lý hợp đồng')}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>
                            <li className="menu nav-item">
                                <NavLink to="/chat" className="group">
                                    <div className="flex items-center">
                                        <IconChatDots className="shrink-0 group-hover:!text-primary" />
                                        <span className="font-semibbold text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {t('Tin nhắn')}
                                        </span>
                                    </div>
                                </NavLink>
                            </li>
                            {/* <li className="menu nav-item">
                                <NavLink to="/managecontract" className="group">
                                    <div className="flex items-center">
                                        <IconHome className="shrink-0 group-hover:!text-primary" />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                            {t('Tin nhắn')}
                                        </span>
                                    </div>
                                </NavLink>
                            </li> */}

                        </ul>
                    )}
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
