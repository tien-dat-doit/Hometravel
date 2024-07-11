import FullCalendar from '@fullcalendar/react';
// import '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Dialog, Transition } from '@headlessui/react';
import moment, { duration } from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import IconX from '../../components/Icon/IconX';
import { setPageTitle } from '../../store/themeConfigSlice';
import roomAPI from '../../util/roomAPI';
import { NumericFormat } from 'react-number-format';

const CalendarUpdatePriceForRoom = ({ roomId, setLoading }: any) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Calendar'));
    });
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
        type: 'info',
    };
    const [params, setParams] = useState<any>(defaultParams);
    useEffect(() => {
        const fetchPriceRoom = async () => {
            setLoading(true)
            try {
                const params = {
                    roomId: roomId,
                    startDate,
                    endDate,               
                };
                const response =
                await roomAPI.getRoomPriceByRangeDateTime(params);
                const dataEvent = response.data;
                const dataShowOnCalendar = dataEvent?.map((event: any, index: any) => {
                    return {
                        title: event?.price ? event?.price : 0,
                        start: event?.date,
                        end: event?.date,
                        className: event?.isWeekend ? "danger" : 'info',
                        id: index,
                    };
                });
                setEvents(dataShowOnCalendar);
                setLoading(false)
            } catch (error) {
                console.log('error', error);
                setLoading(false)
            }
        };
        if (roomId && startDate && endDate && isSubmit === false) {
            fetchPriceRoom();
        }
    }, [roomId, startDate, endDate, isSubmit]);
    const editEvent = (data: any = null) => {
        let params = JSON.parse(JSON.stringify(defaultParams));
        setParams(params);
        if (data) {
            let obj = JSON.parse(JSON.stringify(data.event));          
            setParams({
                id: obj.id ? obj.id : null,
                title: obj?.title || 0,
                start: moment(obj.start).format('YYYY-MM-DD'),
                end: moment(obj.end).format('YYYY-MM-DD'),
            });
            setMinStartDate(new Date());
            setMinEndDate(moment(obj.start).format('YYYY-MM-DD'));
        } else {
            setMinStartDate(new Date());
            setMinEndDate(new Date());
        }

        setIsAddEventModal(true);
    };
    const saveEvent = async () => {
        if (!params.start) {
            return true;
        }
        if (!params.end) {
            return true;
        }
        if (!params.title) {
            return true;
        }
        console.log(params);
        try {
            setIsSubmit(true);
            const responseRoomConfig = await roomAPI.getRoomConfig({
                roomId: roomId,
                startDate: params.start
            })
            console.log("check data res",responseRoomConfig?.data);         
            if(!responseRoomConfig?.data?.length){
            const dataSubmit = {
                startDate: params?.start+"T00:01",
                endDate: params?.start+"T23:59",
                durationPrice: parseInt(params?.title),
                roomId: roomId,
            };
            const responseCreatePrice = await roomAPI.createPriceForRoom(dataSubmit)  
            console.log({responseCreatePrice});       
            }else{
            const dataSubmit = {
                id: responseRoomConfig?.data[0]?.id,
                startDate: params.start+"T00:01",
                endDate: params?.start+"T23:59",
                durationPrice: parseInt(params?.title),
                roomId: roomId,
            };
            const responseUpdatePrice = await roomAPI.updatePriceForRoom(dataSubmit, responseRoomConfig?.data[0]?.id)
            console.log({responseUpdatePrice});
            }
            toast.success("Cập Nhật Thành Công")
            setIsSubmit(false);
            setIsAddEventModal(false)
        } catch (error: any) {
            toast.error(error?.response?.data?.msg || 'Cập Nhật Thất Bại');
            setIsAddEventModal(false)
        }
    };


    return (
        <div>
            <div className="panel mb-5">
                <div className="mb-4 flex w-full items-center justify-between">
                    <p className="text-lg font-bold">Bảng Giá Phòng Tháng</p>
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
                        //select={(event: any) => editDate(event)}
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
                                        Cập Nhật Giá Phòng
                                    </div>
                                    <div className="p-5">
                                        <form className="space-y-5">
                                            <div>
                                                <label htmlFor="title">
                                                    Giá Tiền:
                                                </label>
                                                <NumericFormat
                                                    value={params.title || 0}
                                                    className="form-input"
                                                    id="priceRoomNor"
                                                    placeholder="Nhập giá tiền"
                                                    thousandSeparator={true}
                                                    suffix={' VNĐ'}
                                                    onValueChange={(values) => {
                                                        const {
                                                            formattedValue,
                                                            value,
                                                            floatValue,
                                                        } = values;
                                                        setParams((prev: any)=>({
                                                            ...prev,
                                                            title: floatValue,
                                                        }));
                                                    }}
                                                />
                                                <div
                                                    className="mt-2 text-danger"
                                                    id="titleErr"
                                                ></div>
                                            </div>

                                            <div>
                                                <label htmlFor="dateStart">
                                                    Thời gian:
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
                                                    disabled
                                                />
                                                <div
                                                    className="mt-2 text-danger"
                                                    id="startDateErr"
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

                                                <button
                                                    type="button"
                                                    onClick={() => saveEvent()}
                                                    className="btn btn-primary ltr:ml-4 rtl:mr-4"
                                                >
                                                    Lưu
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

export default CalendarUpdatePriceForRoom;
