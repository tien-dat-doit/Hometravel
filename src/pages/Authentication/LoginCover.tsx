import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconMail from '../../components/Icon/IconMail';
import useAuth from '../../hook/useAuth';
import { IRootState } from '../../store';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import authorizeAPI from '../../util/authorizeAPI';

const LoginCover = () => {
    const dispatch = useDispatch();
    const { setAuth }: any = useAuth();
    useEffect(() => {
        dispatch(setPageTitle('Đăng Nhập'));
    });
    const navigate = useNavigate();
    const isRtl =
        useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl'
            ? true
            : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);
    const [isSubmitLogin, setIsSubmitLogin] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    //TODO: WORK WITH API
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // Làm gì đó với formData (ví dụ: gửi đến server)
        console.log('Submitted data:', formData);

        try {
            setIsSubmitLogin(true);
            const response: any = await authorizeAPI.login({
                email: formData.email,
                password: formData.password,
            });
            localStorage.setItem('access_token', response.data.token);
            localStorage.setItem(
                'userInfor',
                JSON.stringify({
                    id: response?.data?.id,
                    fullName:
                        response?.data?.lastName +
                        ' ' +
                        response?.data?.firstName,
                    email: response?.data?.email,
                    role: response?.data?.role,
                    avatar: response?.data?.avatar ?? '',
                }),
            );
            setAuth({
                user: {
                    id: response?.data?.id,
                    fullName:
                        response?.data?.lastName +
                        ' ' +
                        response?.data?.firstName,
                    email: response?.data?.email,
                    role: response?.data?.role,
                    avatar: response?.data?.avatar ?? '',
                },
                access_token: response?.data?.token,
            });
            navigate('/');
            toast.success('Owner Đăng Nhập Thành Công');
        } catch (error: any) {
            try {
                const response:any = await authorizeAPI.loginAdmin({
                    username: formData.email,
                    password: formData.password,
                });
                localStorage.setItem('access_token', response.data.token);
                localStorage.setItem(
                    'userInfor',
                    JSON.stringify({
                        id: response?.data?.id,
                        fullName:
                            response?.data?.lastName +
                            ' ' +
                            response?.data?.firstName,
                        email: response?.data?.email,
                        role: response?.data?.role,
                    }),
                );
                setAuth({
                    user: {
                        id: response?.data?.id,
                        fullName:
                            response?.data?.lastName +
                            ' ' +
                            response?.data?.firstName,
                        email: response?.data?.email,
                        role: response?.data?.role,
                    },
                    access_token: response?.data?.token,
                });
                navigate('/');
                toast.success('Admin Đăng Nhập Thành Công');
            } catch (ownerError) {
                toast.error(
                    error?.response?.data?.msg ??
                        'Tài Khoản hoặc Mật Khẩu Không Chính Xác !',
                );
            }
        }
        finally {
            setIsSubmitLogin(false);
        };
    };
    return (
        <div>
            {isSubmitLogin && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <span className=" ml-[300px] item-center flex h-[500px] w-[500px] flex-col justify-center gap-3">
                        <h2 className="text-2xl font-bold text-white">
                            Đang xử lý...
                        </h2>
                        <span className="ml-[60px] h-[30px] w-[30px] animate-ping rounded-full bg-info"></span>
                    </span>
                </div>
            )}
            <div className="absolute inset-0">
                <img
                    src="/assets/images/auth/bg-gradient.png"
                    alt="image"
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img
                    src="/assets/images/auth/coming-soon-object1.png"
                    alt="image"
                    className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2"
                />
                <img
                    src="/assets/images/auth/coming-soon-object2.png"
                    alt="image"
                    className="absolute left-24 top-0 h-40 md:left-[30%]"
                />
                <img
                    src="/assets/images/auth/coming-soon-object3.png"
                    alt="image"
                    className="absolute right-0 top-0 h-[300px]"
                />
                <img
                    src="/assets/images/auth/polygon-object.svg"
                    alt="image"
                    className="absolute bottom-0 end-[28%]"
                />
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <Link to="/" className="ms-10 block w-48 lg:w-72">
                                {/* <img
                                    src="/assets/images/auth/logo-trang.png"
                                    alt="Logo"
                                    className="w-full"
                                /> */}
                            </Link>
                            <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                <img
                                    src="/assets/images/auth/login.svg"
                                    alt="Cover Image"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                            <Link to="/" className="block w-8 lg:hidden">
                                <img
                                    src="/assets/images/logo.svg"
                                    alt="Logo"
                                    className="mx-auto w-10"
                                />
                            </Link>
                        </div>
                        <div className="w-full max-w-[440px] lg:mt-16">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">
                                    Đăng Nhập
                                </h1>
                                <p className="text-base font-bold leading-normal text-white-dark">
                                    Vui lòng nhập Email và Mật khẩu để đăng nhập
                                </p>
                            </div>
                            <form
                                className="space-y-5 dark:text-white"
                                onSubmit={handleSubmit}
                            >
                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Email"
                                            type="text"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Vui lòng nhập Email"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Password">Mật Khẩu</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Vui lòng nhập mật khẩu"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="flex cursor-pointer items-center"></label>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                >
                                    Đăng Nhập
                                </button>
                            </form>

                            <div className="relative my-7 text-center md:mb-9">
                                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">
                                    or
                                </span>
                            </div>
                            <div className="text-center dark:text-white">
                                Bạn Chưa Có Tài Khoản ?&nbsp;
                                <Link
                                    to="/register"
                                    className="uppercase text-primary underline transition hover:text-black dark:hover:text-white"
                                >
                                    Đăng Ký
                                </Link>
                            </div>
                            <div className="text-center dark:text-white">
                                <Link
                                    to="/auth/cover-password-reset"
                                    className="uppercase text-primary underline transition hover:text-black dark:hover:text-white"
                                >
                                    Bạn Quên Mật Khẩu ?
                                </Link>
                            </div>
                        </div>
                        <p className="absolute bottom-6 w-full text-center dark:text-white">
                            © {new Date().getFullYear()}.HOMETRAVEL All Rights
                            Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginCover;
