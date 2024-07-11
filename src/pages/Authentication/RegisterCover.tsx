import {
    ErrorMessage,
    Field,
    Form,
    Formik
} from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import MaskedInput from 'react-text-mask';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import IconMail from '../../components/Icon/IconMail';
import IconPhoneCall from '../../components/Icon/IconPhoneCall';
import IconUser from '../../components/Icon/IconUser';
import { IRootState } from '../../store';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import { BankType } from '../../types/bank';
import authorizeAPI from '../../util/authorizeAPI';
import systemConfigAPI from '../../util/systemConfigAPI';
import { db } from '../../notification/firebase';
import {
    collection,
    addDoc,
    where,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    getDocs,
    setDoc,
    doc,
} from 'firebase/firestore';
import useAuth from '../../hook/useAuth';

const RegisterCover = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Đăng Ký'));
    });
    const navigate = useNavigate();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const [flag, setFlag] = useState(themeConfig.locale);
    const [dataAdmin, setDataAdmin] = useState<string>("")

    const [contractFile, setContractFile] = useState<string>("")
    useEffect(()=>{
    const getContractFileAndDataAdmin = async () =>{
        try {
          const res = await systemConfigAPI.getAll()  
          const resAdmin = await authorizeAPI.getAdminAccount()
          setContractFile(res?.data[0]?.contractFile || "")
          setDataAdmin(resAdmin?.data[0]?.id || "")
        } catch (error) {
            console.log({error});
        }
    }
    getContractFileAndDataAdmin()
    },[])
    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Email Không Hợp Lệ !')
            .required('Email Bắt Buộc Phải Có !'),
        firstName: Yup.string().required('Đây Là Thông Tin Bắt Buộc !'),
        lastName: Yup.string().required('Đây Là Thông Tin Bắt Buộc !'),
        password: Yup.string().required('Đây Là Thông Tin Bắt Buộc !'),
        passwordConfirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Mật Khẩu Xác Nhận Không Trùng Khớp !',
        ),
        phone: Yup.string().required('Số điện thoại là bắt buộc !'),
    });

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
                            <Link to="/" className="ms-10 block w-48 lg:w-72">
                            </Link>
                            <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                <img
                                    src="/assets/images/auth/register.svg"
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
                                    Đăng Ký
                                </h1>
                                <p className="text-base font-bold leading-normal text-white-dark"></p>
                            </div>
                            <Formik
                                initialValues={{
                                    email: '',
                                    firstName: '',
                                    lastName: '',
                                    password: '',
                                    passwordConfirmation: '',
                                    phone: '',
                                }}
                                validationSchema={validationSchema}
                                onSubmit={async (values) => {
                                    console.log(values);
                                    try {
                                        const dataSubmit = new FormData();
                                        dataSubmit.append(
                                            'email',
                                            values.email,
                                        );
                                        dataSubmit.append(
                                            'firstName',
                                            values.firstName,
                                        );
                                        dataSubmit.append(
                                            'lastName',
                                            values.lastName,
                                        );
                                        dataSubmit.append(
                                            'phoneNumber',
                                           '0' + values.phone?.toString(),
                                        );
                                        dataSubmit.append(
                                            'password',
                                            values.password,
                                        );
                                        dataSubmit.append('status', 'ACTIVE');
                                        dataSubmit.append('contractFile', contractFile)
                                        const response: any =
                                            await authorizeAPI.register(
                                                dataSubmit,
                                            );
                                        console.log('Đã Chạy Tới', response);

                                        navigate('/contract', {
                                            state: response.data,
                                        });                                            
                                        await setDoc(doc(db, `/userChat/${dataAdmin}/withUser`, response?.data?.id), {
                                            avatar: "https://png.pngtree.com/png-vector/20190623/ourlarge/pngtree-accountavataruser--flat-color-icon--vector-icon-banner-templ-png-image_1491720.jpg",
                                            lastTimeChat: serverTimestamp(),                                         
                                            firstName:values.firstName,
                                            lastName: values.lastName,
                                            phoneNumber: values.phone,
                                            email: values.email,                  
                                        });
                                        await setDoc(doc(db, `/userChat/${response?.data?.id}/withUser`, dataAdmin), {
                                            avatar: "https://t4.ftcdn.net/jpg/04/75/00/99/360_F_475009987_zwsk4c77x3cTpcI3W1C1LU4pOSyPKaqi.jpg",
                                            lastTimeChat: serverTimestamp(),                                         
                                            firstName:"HomeTravel",
                                            lastName: "Admin",
                                            phoneNumber: '',
                                            email: "admin@gmail.com"                  
                                        });
                                        toast.success(response.msg);
                                    } catch (error: any) {
                                        toast.error(
                                            error?.response?.data?.msg ??
                                                'Đăng Ký Không Thành Công',
                                        );
                                    }
                                }}
                            >
                                {({ values }) => (
                                    <Form className="space-y-5 dark:text-white">
                                        <div className="flex">
                                            <div className="">
                                                <label htmlFor="lastName">
                                                    Họ
                                                </label>
                                                <div className="relative text-white-dark">
                                                    <Field
                                                        id="lastName"
                                                        name="lastName"
                                                        type="text"
                                                        placeholder="Vui Lòng Nhập Họ"
                                                        className="form-input ps-10 placeholder:text-white-dark"
                                                    />
                                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                        <IconUser fill={true} />
                                                    </span>
                                                </div>
                                                <div className="ml-2 text-red-400">
                                                    {' '}
                                                    <ErrorMessage
                                                        component="a"
                                                        name={`lastName`}
                                                    />
                                                </div>
                                            </div>

                                            <div className="ml-4">
                                                <label htmlFor="firstName">
                                                    Tên
                                                </label>
                                                <div className="relative text-white-dark">
                                                    <Field
                                                        id="firstName"
                                                        name="firstName"
                                                        type="text"
                                                        placeholder="Vui Lòng Nhập Tên"
                                                        className="form-input ps-10 placeholder:text-white-dark"
                                                    />
                                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                        <IconUser fill={true} />
                                                    </span>
                                                </div>
                                                <div className="ml-2 text-red-400">
                                                    {' '}
                                                    <ErrorMessage
                                                        component="a"
                                                        name={`firstName`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="Email">Email</label>
                                            <div className="relative text-white-dark">
                                                <Field
                                                    id="Email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="Vui Lòng Nhập Email"
                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                />
                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <IconMail fill={true} />
                                                </span>
                                            </div>
                                            <div className="ml-2 text-red-400">
                                                {' '}
                                                <ErrorMessage
                                                    component="a"
                                                    name={`email`}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="">
                                                <label htmlFor="password">
                                                    Mật Khẩu
                                                </label>
                                                <div className="relative text-white-dark">
                                                    <Field
                                                        id="password"
                                                        name="password"
                                                        type="password"
                                                        placeholder="Mật Khẩu.."
                                                        className="form-input ps-10 placeholder:text-white-dark"
                                                    />
                                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                        <IconUser fill={true} />
                                                    </span>
                                                </div>
                                                <div className="ml-2 text-red-400">
                                                    {' '}
                                                    <ErrorMessage
                                                        component="a"
                                                        name={`password`}
                                                    />
                                                </div>
                                            </div>

                                            <div className="ml-4">
                                                <label htmlFor="passwordConfirmation">
                                                    Xác Nhận Mật Khẩu
                                                </label>
                                                <div className="relative text-white-dark">
                                                    <Field
                                                        id="passwordConfirmation"
                                                        name="passwordConfirmation"
                                                        type="password"
                                                        placeholder="Vui lòng nhập mật khẩu xác nhận..."
                                                        className="form-input ps-10 placeholder:text-white-dark"
                                                    />
                                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                        <IconUser fill={true} />
                                                    </span>
                                                </div>
                                                <div className="ml-2 text-red-400">
                                                    {' '}
                                                    <ErrorMessage
                                                        component="a"
                                                        name={`passwordConfirmation`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="">
                                            <label htmlFor="phone">
                                                Số Điện Thoại
                                            </label>
                                            <div className="relative flex items-center text-white-dark">
                                                <span className="absolute left-0 flex items-center px-3 pr-10 text-white-dark">
                                                    <IconPhoneCall
                                                        fill={true}
                                                    />
                                                </span>
                                                <span className="absolute inset-y-0 left-6 flex items-center px-3 text-white-dark">
                                                    (+84)
                                                </span>

                                                <Field name="phone">
                                                    {({ field }: any) => (
                                                        <MaskedInput
                                                            {...field}
                                                            id="phone"
                                                            type="text"
                                                            placeholder=""
                                                            className="form-input flex-grow pl-[80px] pr-6 placeholder:text-white-dark"
                                                            mask={[
                                                                /[1-9]/,
                                                                /[0-9]/,
                                                                /[0-9]/,
                                                                '.',
                                                                /[0-9]/,
                                                                /[0-9]/,
                                                                /[0-9]/,
                                                                '-',
                                                                /[0-9]/,
                                                                /[0-9]/,
                                                                /[0-9]/,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>

                                                <div className="ml-2 text-red-400">
                                                    <ErrorMessage
                                                        component="a"
                                                        name="phone"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* <div className="">
                                            <label htmlFor="phone">
                                                Số Điện Thoại
                                            </label>
                                            <div className="relative flex items-center text-white-dark">
                                                <span className="absolute left-0 flex items-center px-3 pr-10 text-white-dark">
                                                    <IconPhoneCall
                                                        fill={true}
                                                    />
                                                </span>
                                                <span className="absolute inset-y-0 left-6 flex items-center px-3 text-white-dark">
                                                    (+84)
                                                </span>
                                                <Field
                                                    id="phone"
                                                    type="text"
                                                    name="phone"
                                                    placeholder=""
                                                    className="form-input flex-grow pl-[80px] pr-6 placeholder:text-white-dark"
                                                />
                                            </div>
                                            <div>
                                                <ErrorMessage
                                                    component="a"
                                                    name={`phone`}
                                                />
                                            </div>
                                        </div> */}

                                        <button
                                            type="submit"
                                            className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                        >
                                            Đăng Ký
                                        </button>
                                    </Form>
                                )}
                            </Formik>

                            <div className="relative my-7 text-center md:mb-9">
                                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">
                                    or
                                </span>
                            </div>
                            <div className="text-center dark:text-white">
                                Bạn Đã Có Tài Khoản ?&nbsp;
                                <Link
                                    to="/login"
                                    className="uppercase text-primary underline transition hover:text-black dark:hover:text-white"
                                >
                                    Đăng Nhập
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

export default RegisterCover;
