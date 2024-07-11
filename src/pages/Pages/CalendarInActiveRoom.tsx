import FullCalendar from '@fullcalendar/react';
// import '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Dialog, Transition } from '@headlessui/react';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import IconPlus from '../../components/Icon/IconPlus';
import IconX from '../../components/Icon/IconX';
import { setPageTitle } from '../../store/themeConfigSlice';
import roomAPI from '../../util/roomAPI';

const CalendarInActiveRoom = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Calendar'));
    });
    const { roomId } = useParams();
    const [isCreate, setIsCreate] = useState(false);
    const [events, setEvents] = useState<any>();
    const [isAddEventModal, setIsAddEventModal] = useState(false);
    const [minStartDate, setMinStartDate] = useState<any>('');
    const [minEndDate, setMinEndDate] = useState<any>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isSubmit, setIsSubmit] = useState(false);
    const defaultParams = {
        id: null,
        title: '',
        start: '',
        end: '',
        type: 'danger',
    };
    const [params, setParams] = useState<any>(defaultParams);
    useEffect(() => {
        const fetchBookingCalendar = async () => {
            try {
                const params = {
                    roomId: roomId,
                    startDate,
                    endDate,
                    pageSize: 100,
                    status: 'UNAVAILABLE',
                };
                const response = await roomAPI.getListEventInactiveRoom(params);
                console.log('response: ', response.data);
                const dataEvent = response.data;
                const dataShowOnCalendar = dataEvent?.map((event: any) => {
                    return {
                        title: 'Tạm Ngưng Hoạt Động',
                        start: event?.startDate + 'T14:00:00',
                        end: event?.endDate + 'T12:00:00',
                        className: 'danger',
                        id: event?.id,
                    };
                });

                setEvents(dataShowOnCalendar);
            } catch (error) {
                console.log('error', error);
            }
        };
        if (roomId && startDate && endDate && isSubmit === false) {
            fetchBookingCalendar();
        }
    }, [roomId, startDate, endDate, isSubmit]);
    const editEvent = (data: any = null, isCreate: boolean = false) => {
        let params = JSON.parse(JSON.stringify(defaultParams));
        setParams(params);
        console.log({data});
        if (data) {        
            let obj = JSON.parse(JSON.stringify(data.event));
            console.log("check",obj);
            console.log(obj?.end);
            if(!obj?.end){
                console.log("zo");
                const dataLog = events?.filter((event: any)=>event.id === obj?.id)
                console.log({dataLog});
                setParams({
                    id: obj.id ? obj.id : null,
                    title: 'Tạm Ngưng Hoạt Động',
                    start: moment(obj.start).format('YYYY-MM-DD'),
                    end: moment(dataLog[0]?.end).format('YYYY-MM-DD'),
                });
            }else{
                setParams({
                    id: obj.id ? obj.id : null,
                    title: 'Tạm Ngưng Hoạt Động',
                    start: moment(obj.start).format('YYYY-MM-DD'),
                    end: moment(obj.end).format('YYYY-MM-DD'),
                });
            }      
            setMinStartDate(new Date());
            setMinEndDate(moment(obj.start).format('YYYY-MM-DD'));
        } else {
            setMinStartDate(new Date());
            setMinEndDate(new Date());
            isCreate = true;
        }
        isCreate ? setIsCreate(true) : setIsCreate(false);
        setIsAddEventModal(true);
    };
    const editDate = (data: any) => {
        let obj = {
            event: {
                start: data.start,
                end: data.end,
            },
        };
        editEvent(obj, true);
    };
    const saveEvent = async () => {
        if (!params.start) {
            return true;
        }
        if (!params.end) {
            return true;
        }
        try {
            setIsSubmit(true);                 
            if(isCreate){
                const response: any = await roomAPI.updateStatusV2([
                    {
                        roomId: roomId,
                        startDate: params?.start,
                        endDate: params?.end,
                    },
                ]);
                console.log({ response });
                toast.success(response?.msg || 'Cập Nhật Thành Công');
            }else {
                const responseDataOld = await roomAPI.getRoomStatussDetail(params.id)
                const response: any = await roomAPI.activeRoomByOwner(
                    {
                        roomId: roomId,
                        startDate: params?.start,
                        endDate: params?.end,
                        id: params?.id,
                        status:"AVAILABLE",
                        bookingDetailId:responseDataOld?.data?.bookingDetailId || ""
                    },
                    params?.id
                );
                console.log({ response });
                toast.success(response?.msg || 'Cập Nhật Thành Công');
            }
            setIsAddEventModal(false);
            setIsSubmit(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.msg || 'Tạo Thất Bại');
        }
    };
    const startDateChange = (event: any) => {
        const dateStr = event.target.value;
        if (dateStr) {
            setMinEndDate(moment(dateStr).add(1, 'days').format('YYYY-MM-DD'));
            setParams({ ...params, start: dateStr, end: '' });
        }
    };
    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };


    return (
        <div>
            <div className="panel mb-5">
                <div className="mb-4 flex w-full items-center justify-between">
                    <p className="text-lg font-bold">
                        Tạm Ngưng Hoạt Động Phòng
                    </p>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => editEvent()}
                    >
                        <IconPlus className="ltr:mr-2 rtl:ml-2" />
                        Thêm Thời Gian Tạm Ngưng
                    </button>
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
                            right: 'dayGridMonth',
                        }}
                        buttonText={{
                            today: 'Hôm nay',
                            dayGridMonth: 'Tháng',
                        }}
                        locale="vi"
                        displayEventTime={false}
                        editable={true}
                        dayMaxEvents={true}
                        selectable={true}
                        droppable={false}
                        eventClick={(event: any) => editEvent(event)}
                        select={(event: any) => editDate(event)}
                        events={events}
                        datesSet={(arg) => {
                            console.log(arg.start);
                            console.log(arg.end);
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
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                                        {isCreate ? 'Thêm Thời Gian Tạm Ngưng' : 'Thời Gian Tạm Ngưng Hoạt Động'}
                                    </div>
                                    <div className="p-5">
                                        <form className="space-y-5">
                                            <div>
                                                <label htmlFor="title">
                                                   Thao Tác:
                                                </label>
                                                <input
                                                    id="title"
                                                    type="text"
                                                    name="title"
                                                    className="form-input"
                                                    placeholder="Enter Event Title"
                                                    value={
                                                        params.title ||
                                                        'Tạm Ngưng Hoạt Động'
                                                    }
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
                                                    onChange={(event: any) =>
                                                        startDateChange(event)
                                                    }
                                                    required
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
                                                    onChange={(e) =>
                                                        changeValue(e)
                                                    }
                                                    required
                                                />
                                                <div
                                                    className="mt-2 text-danger"
                                                    id="endDateErr"
                                                ></div>
                                            </div>

                                            <div className="!mt-8 flex items-center justify-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-info ltr:ml-4 rtl:mr-4"
                                                    onClick={() =>
                                                        setIsAddEventModal(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    Đóng
                                                </button>
                                                {isCreate ? 
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            saveEvent()
                                                        }
                                                        className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                    >
                                                        Tạm Ngưng Hoạt Động
                                                    </button>
                                                    :
                                                    <button
                                                    type="button"
                                                    onClick={() =>
                                                        saveEvent()
                                                    }
                                                    className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                >
                                                    Mở Hoạt Động
                                                </button>  
                                                }
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

export default CalendarInActiveRoom;
