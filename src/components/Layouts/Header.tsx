import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { IRootState } from '../../store';
import {
    toggleRTL,
    toggleTheme,
    toggleSidebar,
} from '../../store/themeConfigSlice';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import Dropdown from '../Dropdown';
import IconMenu from '../Icon/IconMenu';
import IconCalendar from '../Icon/IconCalendar';
import IconEdit from '../Icon/IconEdit';
import IconChatNotification from '../Icon/IconChatNotification';
import IconSearch from '../Icon/IconSearch';
import IconXCircle from '../Icon/IconXCircle';
import IconSun from '../Icon/IconSun';
import IconMoon from '../Icon/IconMoon';
import IconLaptop from '../Icon/IconLaptop';
import IconMailDot from '../Icon/IconMailDot';
import IconArrowLeft from '../Icon/IconArrowLeft';
import IconInfoCircle from '../Icon/IconInfoCircle';
import IconBellBing from '../Icon/IconBellBing';
import IconUser from '../Icon/IconUser';
import IconMail from '../Icon/IconMail';
import IconLockDots from '../Icon/IconLockDots';
import IconLogout from '../Icon/IconLogout';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuApps from '../Icon/Menu/IconMenuApps';
import IconMenuComponents from '../Icon/Menu/IconMenuComponents';
import IconMenuElements from '../Icon/Menu/IconMenuElements';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';
import IconMenuForms from '../Icon/Menu/IconMenuForms';
import IconMenuPages from '../Icon/Menu/IconMenuPages';
import IconMenuMore from '../Icon/Menu/IconMenuMore';
import useAuth from '../../hook/useAuth';
import { generateToken, messaging } from '../../notification/firebase';
import { onMessage } from 'firebase/messaging';
import { toast } from 'react-toastify';
import notificationAPI from '../../util/notificationAPI';
import moment from 'moment';
import ModalChangePasswordAdmin from '../../pages/Admin/Profile/ModalChangePassAdmin';
interface NotificationObject {
    id: string;
    image: string;
    content: string;
    url: string;
    createdDate: string;
    receiverId: string;
    status: string;
}
interface FilterNotiObject {
    pageIndex: number;
    pageSize: number;
    status?: string | null;
    receiverId: string;
}
const Header = () => {
    const location = useLocation();
    const adminImage = 'https://firebasestorage.googleapis.com/v0/b/home-travel-0262.appspot.com/o/admin%2Fadmin.jpg?alt=media&token=c5c4ee5b-bc54-4cb2-ad99-133b1f18d053';
    const noImage ='https://firebasestorage.googleapis.com/v0/b/home-travel-0262.appspot.com/o/admin%2Fno-image.jpg?alt=media&token=b7c4caab-79ec-4b6b-9569-d25602bbb585'; 
    useEffect(() => {
        const selector = document.querySelector(
            'ul.horizontal-menu a[href="' + window.location.pathname + '"]',
        );
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll(
                'ul.horizontal-menu .nav-link.active',
            );
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul
                    .closest('li.menu')
                    .querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }, [location]);

    const isRtl =
        useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl'
            ? true
            : false;

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();
    const [numberNotiUnRead, setNumberNotiUnRead] = useState(0);
    const { t } = useTranslation();
    const { auth, setAuth }: any = useAuth();
    const navigate = useNavigate();
    const [filterNotiObject, setFilterNotiObject] = useState<FilterNotiObject>({
        pageIndex: 1,
        pageSize: 20,
        receiverId: auth?.user?.id,
    });
    const [isUpdatePassword, setIsUpdatePassword] = useState(false);
    const [canLoadMoreNoti, setCanLoadMoreNoti] = useState(true)
    const [listNoti, setListNoti] = useState<NotificationObject[]>([]);
    const fetchAllNotifications = useCallback(async () => {
        try {
            const response =
            await notificationAPI.getAllNotification(filterNotiObject);
            if(response?.data?.length === 0){
                setCanLoadMoreNoti(false)
                return
            }
            if(response?.data?.length > 0 && filterNotiObject.pageIndex === 1){
                const listNotiSorted = response?.data?.sort((a: any, b: any) => {
                if (a.status === 'SENT' && b.status === 'SEEN') {
                    return -1; // "SENT" trước "SEEN"
                } else if (a.status === 'SEEN' && b.status === 'SENT') {
                    return 1; // "SEEN" sau "SENT"
                } else {
                    return 0; // Giữ nguyên vị trí
                }
                });
                setListNoti(listNotiSorted ?? []);
                setNumberNotiUnRead(
                    listNotiSorted?.filter((noti: any) => noti.status === 'SENT')
                        ?.length ?? 0,
                );
                if(response?.data?.length < filterNotiObject.pageSize){
                    setCanLoadMoreNoti(false)
                }
            }else{
                const listNotiNew = [...listNoti, ...response?.data]
                const listNotiSorted = listNotiNew?.sort((a: any, b: any) => {
                    if (a.status === 'SENT' && b.status === 'SEEN') {
                        return -1; // "SENT" trước "SEEN"
                    } else if (a.status === 'SEEN' && b.status === 'SENT') {
                        return 1; // "SEEN" sau "SENT"
                    } else {
                        return 0; // Giữ nguyên vị trí
                    }
                    });
                setListNoti(listNotiSorted);
                setNumberNotiUnRead((prevNumberUnRead)=>
                    response?.data?.filter((noti: any) => noti.status === 'SENT')
                        ?.length + prevNumberUnRead  ?? prevNumberUnRead,
                );  
            }        
        } catch (error) {
            console.log('Error fetching products:', error);
        }
    }, [filterNotiObject]);
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = await generateToken();            
                const tokenFCMLocalStorage = localStorage.getItem('FCM_token');
                if (tokenFCMLocalStorage !== token) {
                    // subscribe topic
                    
                    try {
                        const payload = [token];
                        const res = await notificationAPI.subscribeTopic(
                            payload,
                            auth?.user?.id,
                        );
                        console.log(res);
                    } catch (error) {
                        console.log({ error });
                    }
                    // save new token
                    localStorage.setItem('FCM_token', token);
                } else {
                    // do nothing
                  
                }

                onMessage(messaging, (payload) => {
                    console.log('payload', payload);
                    if (payload.notification) {
                        fetchAllNotifications();
                        toast.info(
                            'Vui lòng kiểm tra thông báo mới!',
                        );
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };
        fetchToken();
    }, []);
    useEffect(() => {
        fetchAllNotifications();
    }, [filterNotiObject]);
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userInfor');
        setAuth({ user: null, access_token: null });
        navigate('/login');
    };
    const handleLoadMoreNotification = async (e: any) =>{
        e.stopPropagation()
       setFilterNotiObject((prev)=>({...prev, pageIndex: prev.pageIndex + 1}))
    }
    const handleReadNoti = async (id: string) => {
        try {
            const dataSubmit = [
                {
                    id: id,
                    status: 'SEEN',
                },
            ];
            await notificationAPI.readNotification(dataSubmit);
            fetchAllNotifications();
        } catch (error) {
            console.log({ error });
        }
    };
    const handleReadAllNoti = async () => {
        try {
            const dataSubmit = listNoti?.map((noti) => ({
                id: noti.id,
                status: 'SEEN',
            }));
            await notificationAPI.readNotification(dataSubmit);
            fetchAllNotifications();
        } catch (error) {
            console.log({ error });
        }
    };

    return (
        <header
            className={`z-40 ${themeConfig.semidark && themeConfig.menu === 'horizontal' ? 'dark' : ''}`}
        >
            <div className="shadow-sm">
                <ModalChangePasswordAdmin modal17={isUpdatePassword}
                setModal17={setIsUpdatePassword}></ModalChangePasswordAdmin>
                <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">
                    <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
                        <Link
                            to="/"
                            className="main-logo flex shrink-0 items-center"
                        >
                            <img
                                className="inline w-8 ltr:-ml-1 rtl:-mr-1"
                                src="/assets/images/auth/logo-notext.png"
                                alt="logo"
                            />
                            <span className="hidden align-middle text-2xl  font-semibold  transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline"></span>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
                            onClick={() => {
                                dispatch(toggleSidebar());
                            }}
                        >
                            <IconMenu className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="hidden ltr:mr-2 rtl:ml-2 sm:block">
                    </div>
                    <div className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">
                        <div className="sm:ltr:mr-auto sm:rtl:ml-auto">                     
                        </div>
                        <div>
                            {themeConfig.theme === 'light' ? (
                                <button
                                    className={`${
                                        themeConfig.theme === 'light' &&
                                        'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        dispatch(toggleTheme('dark'));
                                    }}
                                >
                                    <IconSun />
                                </button>
                            ) : (
                                ''
                            )}
                            {themeConfig.theme === 'dark' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'dark' &&
                                        'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        dispatch(toggleTheme('system'));
                                    }}
                                >
                                    <IconMoon />
                                </button>
                            )}
                            {themeConfig.theme === 'system' && (
                                <button
                                    className={`${
                                        themeConfig.theme === 'system' &&
                                        'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                    }`}
                                    onClick={() => {
                                        dispatch(toggleTheme('light'));
                                    }}
                                >
                                    <IconLaptop />
                                </button>
                            )}
                        </div>            
                        <div className="dropdown shrink-0">
                            <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                button={
                                    <span>
                                        <IconBellBing />
                                        {numberNotiUnRead > 0 && (
                                            <span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
                                                <span className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"></span>
                                                <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-success"></span>
                                            </span>
                                        )}
                                    </span>
                                }
                            >
                                <ul className="w-[300px] divide-y !py-0 text-dark dark:divide-white/10 dark:text-white-dark sm:w-[350px]">
                                    <li onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-between px-4 py-2 font-semibold">
                                            <h4 className="text-lg">
                                                Thông Báo
                                            </h4>
                                            {numberNotiUnRead > 0 ? (
                                                <span className="badge bg-primary/80">
                                                    {numberNotiUnRead} Thông Báo
                                                    Mới
                                                </span>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </li>
                                    {listNoti.length > 0 ? (
                                        <>
                                            <div className="max-h-[345px] overflow-y-auto ">
                                                {listNoti.map(
                                                    (notification) => {
                                                        return (
                                                            <li
                                                                key={
                                                                    notification.id
                                                                }
                                                                className={`cursor-pointer hover:bg-cyan-100 dark:text-white-light/90 ${notification.status === 'SENT' ? 'bg-white' : 'bg-slate-200'}`}
                                                                onClick={() => {
                                                                    navigate(
                                                                        notification.url,
                                                                    );
                                                                    handleReadNoti(
                                                                        notification.id,
                                                                    );
                                                                }}
                                                            >
                                                                <div className="group flex items-center px-4 py-2">
                                                                    <div className="grid place-content-center rounded">
                                                                        <div className="relative h-12 w-12">
                                                                            <img
                                                                                className="h-12 w-12 rounded-full object-cover"
                                                                                alt="profile"
                                                                                src={
                                                                                    notification?.image
                                                                                }
                                                                            />
                                                                            {/* <span className="absolute bottom-0 right-[6px] block h-2 w-2 rounded-full bg-success"></span> */}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-auto ltr:pl-3 rtl:pr-3">
                                                                        <div>
                                                                            <h6 className="mb-2 dark:text-gray-500">
                                                                                {
                                                                                    notification?.content
                                                                                }
                                                                            </h6>
                                                                            <span className="block text-xs font-normal dark:text-gray-500">
                                                                                {moment(
                                                                                    notification?.createdDate,
                                                                                ).format(
                                                                                    'DD/MM/YYYY - HH:mm',
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="h-1 bg-white"></div>
                                                            </li>
                                                        );
                                                    },
                                                )}
                                            </div>    
                                            <li>
                                                <div className="flex gap-2 p-2">
                                                    <button
                                                        className="btn btn-success btn-small block w-full"
                                                        onClick={
                                                            handleReadAllNoti
                                                        }
                                                    >
                                                        Đã Đọc Tất Cả
                                                    </button>
                                                    {canLoadMoreNoti && <button
                                                        className="btn btn-primary btn-small block w-full"
                                                        onClick={handleLoadMoreNotification}
                                                    >
                                                        Tải Thêm
                                                    </button>}
                                                </div>
                                            </li>
                                        </>
                                    ) : (
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-center text-lg"
                                        >
                                            Hiện không có thông báo
                                        </div>
                                    )}
                                </ul>
                            </Dropdown>
                        </div>
                        <div className="dropdown flex shrink-0">
                        <Dropdown
                                offset={[0, 8]}
                                placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                btnClassName="relative group block"
                                button={
                                    <img
                                        className="h-9 w-9 rounded-full object-cover saturate-50 group-hover:saturate-100 border-1"
                                        src={ auth?.user?.role === "Owner" ? (auth?.user?.avatar || noImage) : adminImage}
                                        alt="userProfile"
                                      
                                    />
                                }
                            >
                                <ul className="w-[270px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                    <li>
                                        <div className="flex items-center px-4 py-4">
                                            <img
                                                className="h-14 w-14 rounded-md object-cover"
                                                src={auth?.user?.role === "Owner" ? (auth?.user?.avatar || noImage) : adminImage}
                                                alt="userProfile"
                                            />
                                            <div className="truncate ltr:pl-4 rtl:pr-4">
                                                <h4 className="text-base">
                                                    {auth?.user?.role === "Owner" ? auth?.user?.fullName : "Quản Trị Viên"}
                                                </h4>

                                                <button
                                                    type="button"
                                                    className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white"
                                                >
                                                    {auth?.user?.email}
                                                </button>
                                                <p className="rounded bg-success-light text-center text-xs text-success">
                                                    {auth?.user?.role ===
                                                    'Owner'
                                                        ? 'Chủ Homestay'
                                                        : 'Quản Trị Viên'}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                    {auth?.user?.role === "Owner" && ( 
                                    <li>
                                        <Link
                                            to="/users/profile"
                                            className="dark:hover:text-white"
                                        >
                                            <IconUser className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                            Thông Tin Cá Nhân
                                        </Link>
                                    </li>     
                                    )}     
                                    {auth?.user?.role === "Admin" && (
                                        <li>
                                        <button
                                            onClick={() => {
                                                setIsUpdatePassword(true);
                                            }}
                                            className="dark:hover:text-white"
                                        >
                                            <IconUser className="h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2" />
                                            Đổi Mật Khẩu
                                        </button>
                                    </li> 
                                    )}                        
                                    <li className="border-t border-white-light dark:border-white-light/10">
                                        <button
                                            onClick={handleLogout}
                                            className="!py-3 text-danger"
                                        >
                                            <IconLogout className="h-4.5 w-4.5 shrink-0 rotate-90 ltr:mr-2 rtl:ml-2" />
                                            Đăng Xuất
                                        </button>
                                    </li>
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <ul className="horizontal-menu hidden border-t border-[#ebedf2] bg-white px-6 py-1.5 font-semibold text-black rtl:space-x-reverse dark:border-[#191e3a] dark:bg-black dark:text-white-dark lg:space-x-1.5 xl:space-x-8">
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuDashboard className="shrink-0" />
                                <span className="px-1">{t('dashboard')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/">{t('sales')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/analytics">
                                    {t('analytics')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/finance">{t('finance')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/crypto">{t('crypto')}</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuApps className="shrink-0" />
                                <span className="px-1">{t('apps')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/apps/chat">{t('chat')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/apps/mailbox">
                                    {t('mailbox')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/apps/todolist">
                                    {t('todo_list')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/apps/notes">{t('notes')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/apps/scrumboard">
                                    {t('scrumboard')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/apps/contacts">
                                    {t('contacts')}
                                </NavLink>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('invoice')}
                                    <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                                    <li>
                                        <NavLink to="/apps/invoice/list">
                                            {t('list')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/apps/invoice/preview">
                                            {t('preview')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/apps/invoice/add">
                                            {t('add')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/apps/invoice/edit">
                                            {t('edit')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <NavLink to="/apps/calendar">
                                    {t('calendar')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuComponents className="shrink-0" />
                                <span className="px-1">{t('components')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/components/tabs">
                                    {t('tabs')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/accordions">
                                    {t('accordions')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/modals">
                                    {t('modals')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/cards">
                                    {t('cards')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/carousel">
                                    {t('carousel')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/countdown">
                                    {t('countdown')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/counter">
                                    {t('counter')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/sweetalert">
                                    {t('sweet_alerts')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/timeline">
                                    {t('timeline')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/notifications">
                                    {t('notifications')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/media-object">
                                    {t('media_object')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/list-group">
                                    {t('list_group')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/pricing-table">
                                    {t('pricing_tables')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/components/lightbox">
                                    {t('lightbox')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuElements className="shrink-0" />
                                <span className="px-1">{t('elements')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/elements/alerts">
                                    {t('alerts')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/avatar">
                                    {t('avatar')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/badges">
                                    {t('badges')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/breadcrumbs">
                                    {t('breadcrumbs')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/buttons">
                                    {t('buttons')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/buttons-group">
                                    {t('button_groups')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/color-library">
                                    {t('color_library')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/dropdown">
                                    {t('dropdown')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/infobox">
                                    {t('infobox')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/jumbotron">
                                    {t('jumbotron')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/loader">
                                    {t('loader')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/pagination">
                                    {t('pagination')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/popovers">
                                    {t('popovers')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/progress-bar">
                                    {t('progress_bar')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/search">
                                    {t('search')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/tooltips">
                                    {t('tooltips')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/treeview">
                                    {t('treeview')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/elements/typography">
                                    {t('typography')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuDatatables className="shrink-0" />
                                <span className="px-1">{t('tables')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/tables">{t('tables')}</NavLink>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('datatables')}
                                    <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                                    <li>
                                        <NavLink to="/datatables/basic">
                                            {t('basic')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/advanced">
                                            {t('advanced')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/skin">
                                            {t('skin')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/order-sorting">
                                            {t('order_sorting')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/multi-column">
                                            {t('multi_column')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/multiple-tables">
                                            {t('multiple_tables')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/alt-pagination">
                                            {t('alt_pagination')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/checkbox">
                                            {t('checkbox')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/range-search">
                                            {t('range_search')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/export">
                                            {t('export')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/datatables/column-chooser">
                                            {t('column_chooser')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuForms className="shrink-0" />
                                <span className="px-1">{t('forms')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/forms/basic">
                                    {t('basic')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/input-group">
                                    {t('input_group')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/layouts">
                                    {t('layouts')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/validation">
                                    {t('validation')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/input-mask">
                                    {t('input_mask')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/select2">
                                    {t('select2')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/touchspin">
                                    {t('touchspin')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/checkbox-radio">
                                    {t('checkbox_and_radio')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/switches">
                                    {t('switches')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/wizards">
                                    {t('wizards')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/file-upload">
                                    {t('file_upload')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/quill-editor">
                                    {t('quill_editor')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/markdown-editor">
                                    {t('markdown_editor')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/date-picker">
                                    {t('date_and_range_picker')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/forms/clipboard">
                                    {t('clipboard')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuPages className="shrink-0" />
                                <span className="px-1">{t('pages')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li className="relative">
                                <button type="button">
                                    {t('users')}
                                    <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                                    <li>
                                        <NavLink to="/users/profile">
                                            {t('profile')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/users/user-account-settings">
                                            {t('account_settings')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <NavLink to="/pages/knowledge-base">
                                    {t('knowledge_base')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/pages/contact-us-boxed"
                                    target="_blank"
                                >
                                    {t('contact_us_boxed')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/pages/contact-us-cover"
                                    target="_blank"
                                >
                                    {t('contact_us_cover')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/pages/faq">{t('faq')}</NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/pages/coming-soon-boxed"
                                    target="_blank"
                                >
                                    {t('coming_soon_boxed')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/pages/coming-soon-cover"
                                    target="_blank"
                                >
                                    {t('coming_soon_cover')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/pages/maintenence"
                                    target="_blank"
                                >
                                    {t('maintenence')}
                                </NavLink>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('error')}
                                    <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                                    <li>
                                        <NavLink
                                            to="/pages/error404"
                                            target="_blank"
                                        >
                                            {t('404')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/pages/error500"
                                            target="_blank"
                                        >
                                            {t('500')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/pages/error503"
                                            target="_blank"
                                        >
                                            {t('503')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('login')}
                                    <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                                    <li>
                                        <NavLink
                                            to="/auth/cover-login"
                                            target="_blank"
                                        >
                                            {t('login_cover')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/auth/boxed-signin"
                                            target="_blank"
                                        >
                                            {t('login_boxed')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('register')}
                                    <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                                    <li>
                                        <NavLink
                                            to="/auth/cover-register"
                                            target="_blank"
                                        >
                                            {t('register_cover')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/auth/boxed-signup"
                                            target="_blank"
                                        >
                                            {t('register_boxed')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('password_recovery')}
                                    <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                                    <li>
                                        <NavLink
                                            to="/auth/cover-password-reset"
                                            target="_blank"
                                        >
                                            {t('recover_id_cover')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/auth/boxed-password-reset"
                                            target="_blank"
                                        >
                                            {t('recover_id_boxed')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                            <li className="relative">
                                <button type="button">
                                    {t('lockscreen')}
                                    <div className="-rotate-90 ltr:ml-auto rtl:mr-auto rtl:rotate-90">
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <ul className="absolute top-0 z-[10] hidden min-w-[180px] rounded bg-white p-0 py-2 text-dark shadow ltr:left-[95%] rtl:right-[95%] dark:bg-[#1b2e4b] dark:text-white-dark">
                                    <li>
                                        <NavLink
                                            to="/auth/cover-lockscreen"
                                            target="_blank"
                                        >
                                            {t('unlock_cover')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to="/auth/boxed-lockscreen"
                                            target="_blank"
                                        >
                                            {t('unlock_boxed')}
                                        </NavLink>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li className="menu nav-item relative">
                        <button type="button" className="nav-link">
                            <div className="flex items-center">
                                <IconMenuMore className="shrink-0" />
                                <span className="px-1">{t('more')}</span>
                            </div>
                            <div className="right_arrow">
                                <IconCaretDown />
                            </div>
                        </button>
                        <ul className="sub-menu">
                            <li>
                                <NavLink to="/dragndrop">
                                    {t('drag_and_drop')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/charts">{t('charts')}</NavLink>
                            </li>
                            <li>
                                <NavLink to="/font-icons">
                                    {t('font_icons')}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/widgets">{t('widgets')}</NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="https://vristo.sbthemes.com"
                                    target="_blank"
                                >
                                    {t('documentation')}
                                </NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;
