import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { toast } from 'react-toastify';
import IconDollarSign from '../../components/Icon/IconDollarSign';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import transactionAPI from '../../util/transactionAPI';

interface BankType {
    id: number;
    name: string;
    code: string;
    bin: string;
    shortName: string;
    logo: string;
    transferSupported: number;
    lookupSupported: number;
    short_name: string;
    support: number;
    isTransfer: number;
    swift_code: string;
}

export default function ModalWithdrawMoney({
    modal17,
    setModal17,
    currentAmountMoney,
    walletId,
}: any) {
    const [recordsBankData, setRecordsBankData] = useState<BankType[]>([]);
    const [searchResultsBank, setSearchResultsBank] = useState<BankType[]>([]);
    const [accountNumberBank, setAccountNumberBank] = useState<any>('');
    const [amountWithdraw, setAmountWithdraw] = useState<any>();
    const [errorAmountWithdraw, setErrorAmountWithdraw] = useState<any>();
    const [errorAccountNumber, setErrorAccountNumber] = useState<any>();
    const [errorSelectBank, setErrorSelectBank] = useState<any>();
    const exampleBankObject = {
        id: -1,
        name: '',
        code: '',
        bin: '',
        shortName: '',
        logo: '',
        transferSupported: -1,
        lookupSupported: -1,
        short_name: '',
        support: -1,
        isTransfer: -1,
        swift_code: '',
    };
    const [selectedBank, setSelectedBank] =
        useState<BankType>(exampleBankObject);
    const [showOption, setShowOption] = useState<Boolean>(false);
    const handleInputChange = (event: any) => {
        const term = event.target.value;
        setShowOption(true);
        if (typeof term === 'string') {
            setSelectedBank((prev)=>({ ...prev, shortName: term, id: -1 }));
        }
        const filteredResults = recordsBankData.filter((option) =>
            option?.shortName.includes(term),
        );
        setSearchResultsBank(filteredResults);
    };

    const handleResultClick = (result: BankType) => {
        setSelectedBank(result);
        setShowOption(false);
        setErrorSelectBank("")
    };
    useEffect(() => {
        const fetchListBanks = async () => {
            try {
                const res = await axios.get('https://api.vietqr.io/v2/banks');
                setRecordsBankData(res?.data?.data ?? []);
            } catch (error) {
                console.log({ error });
            }
        };
        fetchListBanks();
    }, []);
    const handleWithdrawMoney = async () => {
        try {
            let flagCheck = false
            if (!accountNumberBank) {
                setErrorAccountNumber('Vui lòng nhập số tài khoản ngân hàng!');
                toast.error('Vui lòng nhập số tài khoản ngân hàng!');
                flagCheck = true
            }
            if (selectedBank.id === -1) {
                setErrorSelectBank('Vui lòng chọn tên ngân hàng!');
                toast.error('Vui lòng chọn tên ngân hàng!');
               flagCheck = true
            }
            if (!amountWithdraw) {
                setErrorAmountWithdraw('Vui lòng nhập số tiền cần rút!');
                toast.error('Vui lòng nhập số tiền cần rút!');
               flagCheck = true
            }
            if (amountWithdraw < 0) {
                setErrorAmountWithdraw('Số tiền cần rút không hợp lệ!');
                toast.error('Số tiền cần rút không hợp lệ!');
               flagCheck = true
            }
            if (amountWithdraw > currentAmountMoney) {
                toast.error('Số tiền rút vượt quá số dư tài khoản!');
               flagCheck = true
            }
            if(flagCheck){
                return
            }
            const response = await transactionAPI.withDrawMoneyByOwner(
                {
                    amount: amountWithdraw,
                    bankName: selectedBank.shortName,
                    bankNumber: accountNumberBank,
                },
                walletId,
            );
            toast.success(response?.data || 'Rút Tiền Thành Công');
            setModal17(false);
            setAmountWithdraw(0);
            setAccountNumberBank('');
        } catch (error: any) {
            console.log({ error });
            if(error?.response?.data?.msg?.length && error?.response?.data?.msg?.length > 30){
                return toast.error('Rút Tiền Không Thành Công!')
            }
            toast.error(
                error?.response?.data?.msg || 'Rút Tiền Không Thành Công!',
            )
        }
    };

    return (
        <div>
            <Transition appear show={modal17} as={Fragment}>
                <Dialog
                    as="div"
                    open={modal17}
                    onClose={() => setModal17(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div
                        id="standard_modal"
                        className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60"
                    >
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white">
                                    <div className="flex items-center justify-center p-5 text-base font-medium text-[#f3f3f3] dark:text-white">
                                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 dark:bg-[#ef1262]">
                                            {/* Thay đổi icon nếu muốn */}
                                            <IconDollarSign className="h-7 w-7" />{' '}
                                        </span>
                                    </div>
                                    <div className="text-center text-lg font-extrabold text-[#ea1365] dark:text-[#f7f6f6]">
                                        {' '}
                                        Rút Tiền{' '}
                                    </div>
                                    <div className="relative ml-4 mr-3 mt-4">
                                        <label
                                            htmlFor="bankName"
                                            className="font-bold"
                                        >
                                            Tên Ngân Hàng:
                                        </label>
                                        <div>
                                            <input
                                                className="w-full rounded-md border border-gray-300 bg-transparent p-4"
                                                placeholder="Vui lòng nhập tên ngân hàng..."
                                                id="city"
                                                type="text"
                                                value={selectedBank?.shortName}
                                                onDoubleClick={() => {
                                                    setShowOption((prev)=>!prev);
                                                    setSearchResultsBank(
                                                        recordsBankData,
                                                    );
                                                }}
                                                onChange={handleInputChange}
                                                autoComplete="off"
                                            />
                                            {errorSelectBank && (
                                                <div className="p-1 font-semibold text-red-400">
                                                    * {errorSelectBank}
                                                </div>
                                            )}
                                            <div
                                                id="searchResults"
                                                className={`absolute left-[50] top-full z-10 mt-2 max-h-[200px] max-w-[500px] overflow-y-scroll rounded-md border bg-white ${
                                                    showOption ? '' : 'hidden'
                                                }`}
                                            >
                                                {searchResultsBank.length ===
                                                    0 &&
                                                    showOption && (
                                                        <div className="text-center !overflow-hidden p-2 w-[450px]">
                                                            Không Có Kết Quả Tìm
                                                            Kiếm Phù Hợp
                                                        </div>
                                                    )}
                                                {searchResultsBank.length > 0 &&
                                                    searchResultsBank.map(
                                                        (result) => (
                                                            <div
                                                                key={result.id}
                                                                className=" cursor-pointer p-2 hover:bg-gray-100"
                                                                onClick={() =>
                                                                    handleResultClick(
                                                                        result,
                                                                    )
                                                                }
                                                            >
                                                                <div className="flex items-center">
                                                                    <img
                                                                        src={
                                                                            result?.logo
                                                                        }
                                                                        className="h-[50px] w-[50px] rounded-full object-contain"
                                                                    />
                                                                    <span>
                                                                        {' '}
                                                                        {
                                                                            result.shortName
                                                                        }{' '}
                                                                        -{' '}
                                                                        {
                                                                            result.name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative ml-4 mr-3 mt-4">
                                        <label
                                            htmlFor="accountNumber"
                                            className="font-bold"
                                        >
                                            Số Tài Khoản:
                                        </label>
                                        <input
                                            value={accountNumberBank}
                                            id="accountNumber"
                                            className="w-full rounded-md border border-gray-300 bg-transparent p-4"
                                            placeholder="Số tài khoản..."
                                            type="number"
                                            required
                                            onChange={(e) => {
                                                const accountNumberInput =
                                                    e.target.value;
                                                setAccountNumberBank(
                                                    parseInt(
                                                        accountNumberInput,
                                                    ),
                                                );
                                                setErrorAccountNumber('');
                                            }}
                                        />
                                        {errorAccountNumber && (
                                            <div className="p-1 font-semibold text-red-400">
                                                * {errorAccountNumber}
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative ml-4 mr-3 mt-4">
                                        <label
                                            htmlFor="amount"
                                            className="font-bold"
                                        >
                                            Số Tiền Cần Rút:
                                        </label>
                                        <NumericFormat
                                            id="amount"
                                            value={amountWithdraw}
                                            className="mb-3 w-full rounded-md border border-gray-300 bg-transparent p-4"
                                            placeholder="Số tiền..."
                                            thousandSeparator={true}
                                            suffix={' VNĐ'}
                                            onValueChange={(values) => {
                                                const {
                                                    formattedValue,
                                                    value,
                                                    floatValue,
                                                } = values;
                                                if (
                                                    floatValue &&
                                                    floatValue >
                                                        currentAmountMoney
                                                ) {
                                                    setErrorAmountWithdraw(
                                                        'Số tiền rút vượt quá số dư tài khoản!',
                                                    );
                                                    setAmountWithdraw(
                                                        floatValue,
                                                    );
                                                    return;
                                                }
                                                setAmountWithdraw(floatValue);
                                                setErrorAmountWithdraw('');
                                            }}
                                        />
                                        {errorAmountWithdraw && (
                                            <div className="p-1 font-semibold text-red-400">
                                                * {errorAmountWithdraw}
                                            </div>
                                        )}
                                        <span className="p-1 font-semibold text-orange-600">
                                            *Lưu ý: Số tiền tối đa có thể rút là{' '}
                                            {currentAmountMoney?.toLocaleString(
                                                'vi-VN',
                                                {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                },
                                            )}
                                        </span>
                                        <div className="mt-3">
                                            <div className="flex space-x-2">
                                                {currentAmountMoney > 50000 && (
                                                    <button
                                                        onClick={() => {
                                                            setAmountWithdraw(
                                                                50000,
                                                            );
                                                        }}
                                                        className="focus:shadow-outline rounded bg-gray-200 px-4 py-2 font-bold text-gray-700 hover:bg-gray-300 focus:outline-none"
                                                    >
                                                        50.000 đ
                                                    </button>
                                                )}
                                                {currentAmountMoney >
                                                    100000 && (
                                                    <button
                                                        onClick={() => {
                                                            setAmountWithdraw(
                                                                100000,
                                                            );
                                                        }}
                                                        className="focus:shadow-outline rounded bg-gray-200 px-4 py-2 font-bold text-gray-700 hover:bg-gray-300 focus:outline-none"
                                                    >
                                                        100.000 đ
                                                    </button>
                                                )}
                                                {currentAmountMoney >
                                                    200000 && (
                                                    <button
                                                        onClick={() => {
                                                            setAmountWithdraw(
                                                                200000,
                                                            );
                                                        }}
                                                        className="focus:shadow-outline rounded bg-gray-200 px-4 py-2 font-bold text-gray-700 hover:bg-gray-300 focus:outline-none"
                                                    >
                                                        200.000 đ
                                                    </button>
                                                )}
                                                {/* Thêm các nút gợi ý khác... */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <div className="mt-5 flex items-center justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setModal17(false)
                                                }
                                                className="btn btn-outline-primary ltr:ml-4 rtl:mr-4"
                                            >
                                                Đóng
                                            </button>
                                            <button
                                                type="submit"
                                                onClick={() => {
                                                    handleWithdrawMoney();
                                                }}
                                                className="btn btn-outline-success ltr:ml-4 rtl:mr-4"
                                            >
                                                Rút Tiền
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
