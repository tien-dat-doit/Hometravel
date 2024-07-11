import FullCalendar from '@fullcalendar/react';
// import '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconPlus from '../../components/Icon/IconPlus';
import IconX from '../../components/Icon/IconX';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import bookingAPI from '../../util/bookingAPI';

const Calendar = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Calendar'));
    });
    const { id } = useParams();
    const now = new Date();
    const getMonth = (dt: Date, add: number = 0) => {
        let month = dt.getMonth() + 1 + add;
        const str = (month < 10 ? '0' + month : month).toString();
        return str;
    };
    // const [isCreate, setIsCreate] = useState(false);
    const [events, setEvents] = useState<any>();
    const [isAddEventModal, setIsAddEventModal] = useState(false);
    const [minStartDate, setMinStartDate] = useState<any>('');
    const [minEndDate, setMinEndDate] = useState<any>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const renderStatus = (status: string) => {
        switch (status) {
            case 'PAID':
                return { name: 'Thanh Toán Hoàn Tất', color: 'info' };
            case 'DEPOSIT':
                return { name: 'Đã Thanh Toán Cọc', color: 'info' };
            case 'CANCEL':
                return { name: 'Đã Bị Hủy', color: 'info' };
            case 'REFUND':
                return { name: 'Đã Hoàn Tiền', color: 'info' };
            case 'PENDING':
                return { name: 'Chờ Thanh Toán', color: 'info' };
            case 'PAYMENT SETTLEMENT':
                return { name: 'Đang Giải Quyết Thanh Toán', color: 'info' };
            case 'EXPIRED':
                return { name: 'Đơn Quá Hạn', color: 'info' };
            default:
                return { name: 'Chưa Xác Định', color: 'info' };
        }
    };
    const defaultParams = {
        id: null,
        title: '',
        start: '',
        end: '',
        type: 'primary',
    };
    const [params, setParams] = useState<any>(defaultParams);
    useEffect(() => {
        const fetchBookingCalendar = async (id: string) => {
            try {
                const params = {
                    roomId: id,
                    startDate,
                    endDate,
                };
                const response = await bookingAPI.getBookingCalendar(params);
                console.log('response: ', response.data);
                const dataEvent = response.data;
                const dataShowOnCalendar = dataEvent?.map((event: any) => {
                    return {
                        title: event?.bookingDetail?.booking?.tourist?.lastName + " "+ event?.bookingDetail?.booking?.tourist?.firstName+ " - "+(event?.bookingDetail?.booking?.totalPrice?.toLocaleString()+" VNĐ"),
                        start: event?.startDate+"T00:00:00",
                        end: event?.endDate+"T23:59:00",
                        className: renderStatus(event?.bookingDetail?.booking?.status).color,
                        id: event?.id,
                        status: renderStatus(event?.bookingDetail?.booking?.status).name
                    };
                });
                
                setEvents(dataShowOnCalendar);
            } catch (error) {
                console.log('error', error);
            }
        };
        if (id && startDate && endDate) {
            fetchBookingCalendar(id);
        }
    }, [id, startDate, endDate]);
    console.log(events);
    const editEvent = (data: any = null, isCreate: boolean = true) => {
        let params = JSON.parse(JSON.stringify(defaultParams));
        setParams(params);
        if (data) {
            let obj = JSON.parse(JSON.stringify(data.event));
            if(!obj?.end){
                console.log("zo");
                const dataLog = events?.filter((event: any)=>event.id === obj?.id)
                console.log({dataLog});
                setParams({
                    id: obj.id ? obj.id : null,
                    title: obj.title ? obj.title : null,
                    start: moment(obj.start).format('YYYY-MM-DD'),
                    end: moment(dataLog[0]?.end).format('YYYY-MM-DD'),
                    type: obj.classNames ? obj.classNames[0] : 'primary',
                    status: obj?.extendedProps?.status
                });
            }else{
                setParams({
                    id: obj.id ? obj.id : null,
                    title: obj.title ? obj.title : null,
                    start: moment(obj.start).format('YYYY-MM-DD'),
                    end: moment(obj.end).format('YYYY-MM-DD'),
                    type: obj.classNames ? obj.classNames[0] : 'primary',
                    status: obj?.extendedProps?.status
                });
            }
           
            setMinStartDate(new Date());
            setMinEndDate(moment(obj.start).format('YYYY-MM-DD'));
        } else {
            setMinStartDate(new Date());
            setMinEndDate(new Date());
        }
        setIsAddEventModal(true);
        //setIsCreate(isCreate);
    };
    const editDate = (data: any) => {
        //  Bắt đầu check time click là trước hay sau ngày hiện tại bằng moment
        let isCreate = true;
        let momentTime = moment(data.start, 'ddd MMM DD YYYY HH:mm:ss GMTZZ');
        let currentTime = moment();
        if (momentTime.isBefore(currentTime)) {
            isCreate = false;
            console.log('Thời gian từ chuỗi là trước thời gian hiện tại.');
        } else if (momentTime.isAfter(currentTime)) {
            console.log('Thời gian từ chuỗi là sau thời gian hiện tại.');
            isCreate = true;
        } else {
            isCreate = false;
            console.log('Thời gian từ chuỗi là thời gian hiện tại.');
        }
        // Kết thúc check time với moment
        let obj = {
            event: {
                start: data.start,
                end: data.end,
            },
        };
        editEvent(obj, isCreate);
    };

    // const startDateChange = (event: any) => {
    //     const dateStr = event.target.value;
    //     if (dateStr) {
    //         setMinEndDate(moment(dateStr).format('YYYY-MM-DD'));
    //         setParams({ ...params, start: dateStr, end: '' });
    //     }
    // };
    // const changeValue = (e: any) => {
    //     const { value, id } = e.target;
    //     setParams({ ...params, [id]: value });
    // };

    return (
        <div>
            <div className="panel mb-5">
                <div className="mb-4 flex flex-col items-center justify-center sm:flex-row sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                        <div className="text-center text-lg font-semibold ltr:sm:text-left rtl:sm:text-right">
                            Lịch Đặt Phòng
                        </div>
                        
                    </div>
                </div>
                <div className="calendar-wrapper">
                    <FullCalendar
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                        ]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            // right: 'dayGridMonth',
                            right: 'dayGridMonth,timeGridWeek'
                        }}
                        buttonText={{
                            today: 'Hôm nay',
                            dayGridMonth: 'Tháng',
                            timeGridWeek: 'Tuần',
                          }}
                        locale="vi"
                        displayEventTime={false}
                        editable={true}
                        dayMaxEvents={true}
                        selectable={true}
                        droppable={false}
                        eventClick={(event: any) => editEvent(event, false)}
                        // select={(event: any) => editDate(event)}
                        //nextDayThreshold="00:00"
                        events={events}
                        datesSet={(arg) => {
                            console.log(arg.start); //starting visible date
                            console.log(arg.end); //ending visible date
                            setStartDate(
                                moment(arg.start).format('YYYY-MM-DD'),
                            );
                            setEndDate(moment(arg.end).format('YYYY-MM-DD'));
                        }}
                    />
                </div>
            </div>

            {/* add event modal */}
            <Transition appear show={isAddEventModal} as={Fragment}>
                <Dialog
                    as="div"
                    onClose={() => setIsAddEventModal(false)}
                    open={isAddEventModal}
                    className="relative z-[51]"
                >
                    <Transition.Child
                        as={Fragment}
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="duration-300 ease-out"
                                enter-from="opacity-0 scale-95"
                                enter-to="opacity-100 scale-100"
                                leave="duration-200 ease-in"
                                leave-from="opacity-100 scale-100"
                                leave-to="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                        onClick={() =>
                                            setIsAddEventModal(false)
                                        }
                                    >
                                        <IconX />
                                    </button>
                                    <div className="bg-[#fbfbfb] py-3 text-center text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                                        {'Thông Tin Đặt Phòng'}
                                    </div>
                                    <div className="p-5">
                                        <form className="space-y-5">
                                            <div>
                                                <label htmlFor="title">
                                                    Tên Khách Hàng & Tiền Thanh Toán:
                                                </label>
                                                <input
                                                    id="title"
                                                    type="text"
                                                    name="title"
                                                    className="form-input"
                                                    placeholder="Tên khách hàng"
                                                    value={params.title || ''}
                                                    // onChange={(e) =>
                                                    //     changeValue(e)
                                                    // }
                                                    // required
                                                    disabled
                                                />
                                                <div
                                                    className="mt-2 text-danger"
                                                    id="titleErr"
                                                ></div>
                                            </div>

                                            <div>
                                                <label htmlFor="dateStart">
                                                    Từ ngày:
                                                </label>
                                                <input
                                                    id="start"
                                                    type="date"
                                                    name="start"
                                                    className="form-input"
                                                    placeholder="Event Start Date"
                                                    value={
                                                        params.start
                                                            ? moment(
                                                                  params.start,
                                                              ).format(
                                                                  'YYYY-MM-DD',
                                                              )
                                                            : ''
                                                    }
                                                    min={minStartDate}
                                                    // onChange={(event: any) =>
                                                    //     startDateChange(event)
                                                    // }
                                                    // required
                                                    disabled
                                                />
                                                <div
                                                    className="mt-2 text-danger"
                                                    id="startDateErr"
                                                ></div>
                                            </div>
                                            <div>
                                                <label htmlFor="dateEnd">
                                                    Đến ngày:
                                                </label>
                                                <input
                                                    id="end"
                                                    type="date"
                                                    name="end"
                                                    className="form-input"
                                                    placeholder="Event End Date"
                                                    value={
                                                        params.end
                                                            ? moment(
                                                                  params.end,
                                                              ).format(
                                                                  'YYYY-MM-DD',
                                                              )
                                                            : ''
                                                    }
                                                    min={minEndDate}
                                                    // onChange={(e) =>
                                                    //     changeValue(e)
                                                    // }
                                                    disabled
                                                    // required
                                                />
                                                <div
                                                    className="mt-2 text-danger"
                                                    id="endDateErr"
                                                ></div>
                                            </div>
                                            <div>
                                                <label htmlFor="status">
                                                    Trạng Thái Thanh Toán:
                                                </label>
                                                <input
                                                    id="status"
                                                    type="text"
                                                    name="status"
                                                    className="form-input"                                                  
                                                    value={params.status}
                                                    disabled
                                                />
                                                <div
                                                    className="mt-2 text-danger"
                                                    id="titleErr"
                                                ></div>
                                            </div>
                                            <div className="!mt-8 flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-info w-full"
                                                    onClick={() =>
                                                        setIsAddEventModal(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    Đóng
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Calendar;
