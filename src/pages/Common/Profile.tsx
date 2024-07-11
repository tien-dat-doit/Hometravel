import {
    doc,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MaskedInput from 'react-text-mask';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import IconCamera from '../../components/Icon/IconCamera';
import IconCoffee from '../../components/Icon/IconCoffee';
import IconLock from '../../components/Icon/IconLock';
import IconMail from '../../components/Icon/IconMail';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import IconPhone from '../../components/Icon/IconPhone';
import IconPhoneCall from '../../components/Icon/IconPhoneCall';
import IconUser from '../../components/Icon/IconUser';
import useAuth from '../../hook/useAuth';
import { db } from '../../notification/firebase';
import { setPageTitle } from '../../store/themeConfigSlice';
import authorizeAPI from '../../util/authorizeAPI';
import systemConfigAPI from '../../util/systemConfigAPI';
import walletAPI from '../../util/walletAPI';
import ModalChangePasswordOwner from '../Components/ModalChangePassOwner';
import ModalWithdrawMoney from '../Components/ModalWithdrawMoney';
import TableTransactionOwner from '../Components/TableTransactionOwner';
import ProfitChart from '../Pages/ProfitChart';
interface user {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    phoneNumber: string;
    status: string;
    contractFile: string;
}
interface walletObject {
    id: string;
    balance: number;
    ownerId: string;
    touristId: string;
    adminId: string;
}

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Email Không Hợp Lệ !')
        .required('Email Bắt Buộc Phải Có !'),
    firstName: Yup.string().required('Đây Là Thông Tin Bắt Buộc !'),
    lastName: Yup.string().required('Đây Là Thông Tin Bắt Buộc !'),
    phone: Yup.string().required('Số điện thoại là bắt buộc !'),
});

const Profile = () => {
    const dispatch = useDispatch();
    const { auth, setAuth }: any = useAuth();
    useEffect(() => {
        dispatch(setPageTitle('Profile'));
    });
    const userObjectExample = {
        id: '',
        email: 'lyquoclam123@gmail.com',
        firstName: 'Lam',
        lastName: 'Ly Quoc',
        avatar: '',
        phoneNumber: '0888666888',
        status: 'ACTIVE',
        contractFile: '',
    };
    const [userProfile, setUserProfile] = useState<user>(userObjectExample);
    const walletExample = {
        id: '',
        adminId: '',
        balance: 0,
        ownerId: '',
        touristId: '',
    };
    const [walletInfo, setWalletInfo] = useState<walletObject>(walletExample);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isWithdrawMoney, setIsWithdrawMoney] = useState(false);
    const [isUpdatePassword, setIsUpdatePassword] = useState(false);
    const [imgSrc, setImgSrc] = useState('');
    const [idAdmin, setIdAdmin] = useState('');

    const fetchUserProfile = useCallback(async (id: any) => {
        try {
            const response = await authorizeAPI.getOwnerProfile(id);
            console.log({ response });
            setUserProfile(response?.data ?? userObjectExample);
            setImgSrc(
                response?.data?.avatar ?? '/assets/images/default_ava.jpg',
            );
            localStorage.setItem(
                'userInfor',
                JSON.stringify({
                    id: response?.data?.id,
                    fullName:
                        response?.data?.lastName +
                        ' ' +
                        response?.data?.firstName,
                    email: response?.data?.email,
                    role: 'Owner',
                    avatar: response?.data?.avatar ?? '',
                }),
            );
            setAuth({
                ...auth,
                user: {
                    id: response?.data?.id,
                    fullName:
                        response?.data?.lastName +
                        ' ' +
                        response?.data?.firstName,
                    email: response?.data?.email,
                    role: 'Owner',
                    avatar: response?.data?.avatar ?? '',
                },
            });
            const resAdmin = await authorizeAPI.getAdminAccount();
            if (resAdmin?.data[0]?.id) {
                setIdAdmin(resAdmin?.data[0]?.id);
                await updateDoc(
                    doc(
                        db,
                        `/userChat/${resAdmin?.data[0]?.id}/withUser`,
                        response?.data?.id,
                    ),
                    {
                        avatar:
                            response?.data?.avatar ||
                            'https://png.pngtree.com/png-vector/20190623/ourlarge/pngtree-accountavataruser--flat-color-icon--vector-icon-banner-templ-png-image_1491720.jpg',
                        lastTimeChat: serverTimestamp(),
                        firstName: response?.data?.firstName,
                        lastName: response?.data?.lastName,
                        phoneNumber: response?.data?.phoneNumber,
                        email: response?.data?.email,
                    },
                );
            }
        } catch (error) {
            console.log('Error get profile: ', error);
            toast.error('Lấy thông tin thất bại');
        }
    }, []);
    ('');
    const [contractFile, setContractFile] = useState<string>('');
    useEffect(() => {
        const fetchDataWallet = async (id: string) => {
            try {
                const response = await walletAPI.getWalletOwnerInformation(id);
                console.log(response.data);
                setWalletInfo(response.data[0] ?? walletExample);
            } catch (error) {
                console.log({ error });
            }
        };
        const getContractFileAndDataAdmin = async () => {
            try {
                const res = await systemConfigAPI.getAll();
                const resAdmin = await authorizeAPI.getAdminAccount();
                setContractFile(res?.data[0]?.contractFile || '');
            } catch (error) {
                console.log({ error });
            }
        };
        getContractFileAndDataAdmin();
        if (auth?.user?.id && isWithdrawMoney === false) {
            fetchUserProfile(auth?.user?.id);
            fetchDataWallet(auth?.user?.id);
        }
    }, [isWithdrawMoney]);
    return (
        <div>
            <div className="pt-5">
                <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                    <div className="panel">
                        <div className="mb-5 flex items-center justify-between">
                            <h5 className="text-lg font-semibold dark:text-white-light">
                                Thông tin người dùng
                            </h5>
                            <button
                                className="btn btn-primary rounded-full p-2 ltr:ml-auto rtl:mr-auto"
                                onClick={() => setIsUpdate((prev) => !prev)}
                            >
                                <IconPencilPaper />
                            </button>
                        </div>
                        {isUpdate === false && (
                            <div className="mb-5">
                                <div className="flex flex-col items-center justify-center">
                                    <img
                                        src={imgSrc}
                                        alt="img"
                                        className="mb-5 h-[200px] w-[200px] rounded-full object-cover"
                                    />
                                    <p className="text-xl font-semibold text-primary">
                                        {userProfile.lastName +
                                            ' ' +
                                            userProfile.firstName}
                                    </p>
                                </div>
                                <ul className="m-auto mt-5 flex max-w-[180px] flex-col space-y-4 font-semibold text-white-dark">
                                    <li className="flex items-center gap-2">
                                        <IconCoffee className="shrink-0" />
                                        {auth?.user?.role === 'Owner'
                                            ? 'Chủ Homestay'
                                            : 'Quản Trị Viên'}
                                    </li>
                                    <li>
                                        <button className="flex items-center gap-2">
                                            <IconMail className="h-5 w-5 shrink-0" />
                                            <span className="truncate">
                                                {userProfile.email}
                                            </span>
                                        </button>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <IconPhone />
                                        <span
                                            className="whitespace-nowrap"
                                            dir="ltr"
                                        >
                                            {userProfile.phoneNumber}
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <IconLock />
                                        <button
                                            onClick={() => {
                                                setIsUpdatePassword(true);
                                            }}
                                            className="hover:text-primary-dark flex items-center gap-2 text-primary transition-colors focus:outline-none"
                                        >
                                            Đổi mật khẩu
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                        {/* Update user profile here */}
                        {isUpdate && userProfile?.id !== '' && (
                            <Formik
                                initialValues={{
                                    email: userProfile.email,
                                    firstName: userProfile.firstName ?? '',
                                    lastName: userProfile.lastName ?? '',
                                    phone: userProfile.phoneNumber,
                                    avatar: '',
                                }}
                                validationSchema={validationSchema}
                                onSubmit={async (values) => {
                                    console.log(values);
                                    try {
                                        const dataSubmit = new FormData();
                                        dataSubmit.append('id', auth?.user?.id);
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
                                        if (values.phone.startsWith('0')) {
                                            dataSubmit.append(
                                                'phoneNumber',
                                                values.phone?.toString(),
                                            );
                                        } else {
                                            dataSubmit.append(
                                                'phoneNumber',
                                                '0' + values.phone?.toString(),
                                            );
                                        }

                                        dataSubmit.append('status', 'ACTIVE');
                                        if (values.avatar) {
                                            dataSubmit.append(
                                                'avatar',
                                                values.avatar,
                                            );
                                        }
                                        const response: any =
                                            await authorizeAPI.updateProfileOwner(
                                                auth?.user?.id,
                                                dataSubmit,
                                            );
                                        console.log({ response });
                                        await updateDoc(
                                            doc(
                                                db,
                                                `/userChat/${idAdmin}/withUser`,
                                                response?.data?.id,
                                            ),
                                            {
                                                avatar:
                                                    response?.data?.avatar ||
                                                    'https://png.pngtree.com/png-vector/20190623/ourlarge/pngtree-accountavataruser--flat-color-icon--vector-icon-banner-templ-png-image_1491720.jpg',
                                                lastTimeChat: serverTimestamp(),
                                                firstName:
                                                    response?.data?.firstName,
                                                lastName:
                                                    response?.data?.lastName,
                                                phoneNumber:
                                                    response?.data?.phoneNumber,
                                                email: response?.data?.email,
                                            },
                                        );
                                        toast.success('Cập nhật thành công');
                                        fetchUserProfile(auth?.user?.id);
                                        setIsUpdate(false);
                                    } catch (error: any) {
                                        toast.error(
                                            error?.response?.data?.msg ??
                                                'Cập nhật thành công',
                                        );
                                    }
                                }}
                            >
                                {({ values }) => (
                                    <Form className="space-y-5 dark:text-white">
                                        <div className="mb-6 w-full">
                                            {imgSrc && (
                                                <img
                                                    alt="avatar"
                                                    src={imgSrc}
                                                    className="m-auto h-[200px] w-[200px] rounded-full"
                                                />
                                            )}
                                            <Field name="avatar">
                                                {({
                                                    field,
                                                    form,
                                                    meta,
                                                }: any) => (
                                                    <>
                                                        <label
                                                            htmlFor="avatar"
                                                            className="btn btn-primary mb-2 me-1 mt-2 rounded-md bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-2 py-2 text-center text-sm font-bold text-white shadow-lg shadow-blue-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:shadow-lg dark:shadow-blue-800/80 dark:focus:ring-blue-800"
                                                        >
                                                            <IconCamera className="h-5 w-5 shrink-0 ltr:mr-1.5 rtl:ml-1.5" />
                                                            Chọn hình
                                                            <input
                                                                hidden
                                                                type="file"
                                                                id="avatar"
                                                                accept="image/png, image/jpeg"
                                                                onChange={(
                                                                    event: any,
                                                                ) => {
                                                                    const reader =
                                                                        new FileReader();
                                                                    const files =
                                                                        event
                                                                            .currentTarget
                                                                            .files;
                                                                    if (
                                                                        files &&
                                                                        files.length !==
                                                                            0
                                                                    ) {
                                                                        reader.onload =
                                                                            () =>
                                                                                setImgSrc(
                                                                                    reader.result as string,
                                                                                );
                                                                        reader.readAsDataURL(
                                                                            files[0],
                                                                        );
                                                                    }
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        event
                                                                            .currentTarget
                                                                            .files[0],
                                                                    );
                                                                }}
                                                            />
                                                        </label>

                                                        {meta.touched &&
                                                            !!meta.error && (
                                                                <div
                                                                    style={{
                                                                        color: '#F8719D',
                                                                    }}
                                                                >
                                                                    {meta.error}
                                                                </div>
                                                            )}
                                                    </>
                                                )}
                                            </Field>
                                        </div>

                                        <div className="">
                                            <label htmlFor="lastName">Họ</label>
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
                                            <div className="text-red-400">
                                                {' '}
                                                <ErrorMessage
                                                    component="a"
                                                    name={`lastName`}
                                                />
                                            </div>
                                        </div>

                                        <div className="ml-0">
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
                                            </div>
                                            <div className="text-red-400">
                                                <ErrorMessage
                                                    component="a"
                                                    name="phone"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                        >
                                            Cập nhật
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        )}
                    </div>
                    <div className="panel rounded-lg bg-white p-6 dark:bg-gray-800 lg:col-span-2 xl:col-span-3">
                        <div className="mb-5">
                            <h5 className="text-lg font-semibold dark:text-white-light">
                                Ví Tài Khoản
                            </h5>
                        </div>
                        <div className="mb-5">
                            <div className="table-responsive font-semibold text-[#515365] dark:text-white-light">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="mr-2 inline-flex items-center text-4xl font-extrabold text-green-500">
                                        {Number(
                                            walletInfo.balance,
                                        ).toLocaleString('vi-VN')}{' '}
                                        <span className="ml-3">VNĐ</span>
                                    </div>
                                    <button 
                                    onClick={()=>{setIsWithdrawMoney(true)}}
                                    className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none">
                                        Rút tiền
                                    </button>
                                </div>
                                <ProfitChart walletId={walletInfo.id} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel flex">
                    <div
                        className={`${userProfile?.contractFile ? 'w-1/2' : 'w-full'}`}
                    >
                        <div className="mb-5 flex items-center justify-between"></div>
                        <TableTransactionOwner isWithdrawMoney={isWithdrawMoney} walletId={walletInfo.id} />
                    </div>
                    {/* {userProfile?.contractFile && (
                        <div className="flex w-1/2 justify-center">
                            <object
                                data={userProfile?.contractFile}
                                type="application/pdf"
                                className="h-[600px] w-[780px]"
                            ></object>
                        </div>
                    )} */}
                    {contractFile && (
                        <div className="flex w-1/2 justify-center p-5">
                            <object
                                data={contractFile}
                                type="application/pdf"
                                className="h-[600px] w-[780px]"
                            ></object>
                        </div>
                    )}
                </div>
            </div>
            <ModalChangePasswordOwner
                modal17={isUpdatePassword}
                setModal17={setIsUpdatePassword}
            />
            <ModalWithdrawMoney
             modal17={isWithdrawMoney}
             setModal17={setIsWithdrawMoney}
             currentAmountMoney={walletInfo.balance}
             walletId={walletInfo.id}
            />
        </div>
    );
};

export default Profile;
