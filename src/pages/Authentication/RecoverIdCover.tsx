import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import Dropdown from '../../components/Dropdown';
import { IRootState } from '../../store';
import i18next from 'i18next';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconMail from '../../components/Icon/IconMail';

const RecoverIdCover = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Recover Id Box'));
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

    const [formStep, setFormStep] = useState('email'); // 'email', 'confirmationCode', 'password'
    const [confirmationCode, setConfirmationCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const submitForm = (e: any) => {
        e.preventDefault();

        if (formStep === 'email') {
            // Thực hiện xác nhận email và chuyển sang bước nhập mã xác nhận
            // (Bạn cần thêm logic xác nhận email ở đây)

            setFormStep('confirmationCode');
        } else if (formStep === 'confirmationCode') {
            // Thực hiện xác nhận mã xác nhận và chuyển sang bước nhập mật khẩu
            // (Bạn cần thêm logic xác nhận mã xác nhận ở đây)

            setFormStep('password');
        } else if (formStep === 'password') {
            // Thực hiện xử lý mật khẩu, bạn có thể gửi request đến server để đặt lại mật khẩu
            // (Bạn cần thêm logic đặt lại mật khẩu ở đây)
            console.log('Password reset successful!');

            // Sau khi đặt lại mật khẩu thành công, có thể chuyển sang một trang khác hoặc hiển thị thông báo thành công.
            navigate('/auth/cover-login');
        }
    };

    return (
        <div>
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
                            {/* <Link to="/" className="ms-10 block w-48 lg:w-72">
                                <img
                                    src="/assets/images/auth/logo-white.svg"
                                    alt="Logo"
                                    className="w-full"
                                />
                            </Link> */}
                            <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                <img
                                    src="/assets/images/auth/reset-password.svg"
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
                            <div className="mb-7">
                                <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white">
                                    {formStep === 'email' && 'Đặt Lại Mật Khẩu'}
                                    {formStep === 'confirmationCode' &&
                                        'Xác Nhận Email'}
                                    {formStep === 'password' &&
                                        'Nhập Mật Khẩu Mới'}
                                </h1>
                                {formStep === 'email' && (
                                    <p>
                                        Nhập Email Của Bạn Để Đặt Lại Mật Khẩu
                                    </p>
                                )}
                                {formStep === 'confirmationCode' && (
                                    <p>
                                        Nhập Mã Xác Nhận Đã Gửi Về Email Của Bạn
                                    </p>
                                )}
                                {formStep === 'password' && (
                                    <p>Nhập Mật Khẩu Mới Của Bạn</p>
                                )}
                            </div>
                            <form className="space-y-5" onSubmit={submitForm}>
                                {formStep === 'email' && (
                                    <div>
                                        <label htmlFor="Email">Email</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="Email"
                                                type="email"
                                                placeholder="Vui lòng nhập Email của bạn"
                                                className="form-input pl-10 placeholder:text-white-dark"
                                            />
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2">
                                                <IconMail fill={true} />
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {formStep === 'confirmationCode' && (
                                    <div>
                                        <label htmlFor="ConfirmationCode">
                                            Mã Xác Nhận
                                        </label>
                                        <input
                                            id="ConfirmationCode"
                                            type="text"
                                            placeholder="Nhập Mã Xác Nhận Được Gửi Qua Email"
                                            className="form-input"
                                            value={confirmationCode}
                                            onChange={(e) =>
                                                setConfirmationCode(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                )}
                                {formStep === 'password' && (
                                    <>
                                        <div>
                                            <label htmlFor="Password">
                                                Mật Khẩu Mới
                                            </label>
                                            <input
                                                id="Password"
                                                type="password"
                                                placeholder="Enter Password"
                                                className="form-input"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="ConfirmPassword">
                                                Nhập Lại Mật Khẩu
                                            </label>
                                            <input
                                                id="ConfirmPassword"
                                                type="password"
                                                placeholder="Confirm Password"
                                                className="form-input"
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </>
                                )}
                                <button
                                    type="submit"
                                    className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                >
                                    {formStep === 'email' && 'Đặt Lại'}
                                    {formStep === 'confirmationCode' &&
                                        'Xác Nhận'}
                                    {formStep === 'password' && 'Lưu Mật Khẩu'}
                                </button>
                            </form>
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

export default RecoverIdCover;
