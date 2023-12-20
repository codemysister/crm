
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import DashboardLayout from '@/Layouts/DashboardLayout';
import HeaderModule from '@/Components/HeaderModule';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { useForm } from '@inertiajs/react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Steps } from 'primereact/steps';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Badge } from 'primereact/badge';
import { TabMenu } from 'primereact/tabmenu';
import { TabPanel, TabView } from 'primereact/tabview';
import { Skeleton } from 'primereact/skeleton';
import { FilterMatchMode } from 'primereact/api';

export default function Index({auth}) {
    
    const [partners, setPartners] = useState('');
    const [pics, setPics] = useState('');
    const [sales, setSales] = useState('');
    const [subscriptions, setSubscriptions] = useState('');
    const [account_managers, setAccountManagers] = useState('');
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [modalPartnersIsVisible, setModalPartnersIsVisible] = useState(false);
    const [modalEditPartnersIsVisible, setModalEditPartnersIsVisible] = useState(false);
    const [modalPicIsVisible, setModalPicIsVisible] = useState(false);
    const [modalEditPicIsVisible, setModalEditPicIsVisible] = useState(false);
    const toast = useRef(null);
    const btnSubmit = useRef(null);
    const modalPartner = useRef(null);
    const {roles, permissions} = auth.user;
    const [activeIndex, setActiveIndex] = useState(0);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    
    const { data, setData, post, put, delete: destroy, reset, processing, errors }  = useForm({   
        
        partner: {
            uuid: '',
            sales: {},
            account_manager: {},
            name: '',
            register_date: '',
            live_date: '',
            address: '',
            status: ''
        },
        pic: {
            name: '',
            number: '',
            position: '',
            address: '',
        },
        subscription: {
            nominal: 0,
            period: 1,
            bank: '',
            account_bank_number: '',
            account_bank_name: '',
        }
    });


    const { data: dataPIC, setData: setDataPIC, post: postPIC, put: putPIC, delete: destroyPIC, reset: resetPIC, processing: processingPIC, errors:errorPIC }  = useForm({
        uuid:'',
        partner: {},
        name: '',
        number: '',
        position: '',
        address: ''
    })

    const status = [
        { name: 'Proses'},
        { name: 'Aktif'},
        { name: 'CLBK'},
        { name: 'Non Aktif'},
    ];
    
    const selectedOptionTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const optionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const selectedAccountManagerTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const accountManagerOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };

    const getPartners = async () => {
        setIsLoadingData(true)
        
        let response = await fetch('/api/partners');
        let data = await response.json();
   
        setPartners(prev => data.partners);
        setSales(prev => data.sales);
        setAccountManagers(prev => data.account_managers);
       
        setIsLoadingData(false)
    }

    const getPics = async () => {
        setIsLoadingData(true)
        
        let response = await fetch('/api/partners/pics');
        let data = await response.json();
   
        setPics(prev => data);
       
        setIsLoadingData(false)
    }

    const getSubscriptions = async () => {
        setIsLoadingData(true)
        
        let response = await fetch('/api/partners/subscriptions');
        let data = await response.json();
   
        setSubscriptions(prev => data);
       
        setIsLoadingData(false)
    }

    useEffect(()=>{
        const fetchData = async () => {
            try {
              await Promise.all([getPartners(), getPics(), getSubscriptions()]);
              setIsLoadingData(false);
              setPreRenderLoad(prev => prev=false)
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      
          fetchData();
    }, [])

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => handleEditPartner(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => {handleDeletePartner(rowData)}} />
            </React.Fragment>
        );
    };

    const actionBodyTemplatePIC = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => handleEditPIC(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => {handleDeletePIC(rowData)}} />
            </React.Fragment>
        );
    };

    const actionBodyTemplateSubscriptipn = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => handleEditSubscription(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => {handleDeleteSubscription(rowData)}} />
            </React.Fragment>
        );
    };

    let categories = [
        {name: 'Produk'},
        {name: 'Layanan'},
    ]

    const items = [
        {
            label: 'Data Partner',
        },
        {
            label: 'PIC'
        },
        {
            label: 'Langganan'
        }
    ];

    // fungsi toast
    const showSuccess = (type) => {
        toast.current.show({severity:'success', summary: 'Success', detail:`${type} data berhasil`, life: 3000});
    }

    const showError = (type) => {
        toast.current.show({severity:'error', summary: 'Error', detail:`${type} data gagal`, life: 3000});
    }


    const handleEditPartner = (partner) => {
        setData((prevData) => ({
            ...prevData,
            partner: {
                ...prevData.partner,
                uuid: partner.uuid,
                name: partner.name,
                sales: partner.sales,
                account_manager: partner.account_manager,
                register_date: partner.register_date,
                live_date: partner.live_date,
                address: partner.address,
                status: partner.status
            },
        }));
        setModalEditPartnersIsVisible(true);
    };

    const handleDeletePartner = (partner) => {
        confirmDialog({
            message: 'Apakah Anda yakin untuk menghapus ini?',
            header: 'Konfirmasi hapus',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept : async ()=> {
                
                destroy('partners/'+partner.uuid, {
                    onSuccess: () => {
                        getPartners();
                        showSuccess('Hapus');
                    },
                    onError: () => {
                        showError('Hapus')
                    }
                })
            },
        });
    }

    const handleEditPIC = (pic) => {
       
        setDataPIC(data => ({ ...data, uuid: pic.uuid}));
        setDataPIC(data => ({ ...data, partner: pic.partner}));
        setDataPIC(data => ({ ...data, name: pic.name}));
        setDataPIC(data => ({ ...data, number: pic.number}));
        setDataPIC(data => ({ ...data, position: pic.position}));
        setDataPIC(data => ({ ...data, address: pic.address}));
        
        setModalEditPicIsVisible(true);
    };

    const handleDeletePIC = (pic) => {
        confirmDialog({
            message: 'Apakah Anda yakin untuk menghapus ini?',
            header: 'Konfirmasi hapus',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept : async ()=> {
                
                destroyPIC('partners/pics/'+pic.uuid, {
                    onSuccess: () => {
                        getPics();
                        showSuccess('Hapus');
                    },
                    onError: () => {
                        showError('Hapus')
                    }
                })
            },
        });
    }

    const handleEditSubscription = (pic) => {
       
        setDataPIC(data => ({ ...data, uuid: pic.uuid}));
        setDataPIC(data => ({ ...data, partner: pic.partner}));
        setDataPIC(data => ({ ...data, name: pic.name}));
        setDataPIC(data => ({ ...data, number: pic.number}));
        setDataPIC(data => ({ ...data, position: pic.position}));
        setDataPIC(data => ({ ...data, address: pic.address}));
        
        setModalEditPicIsVisible(true);
    };

    const handleDeleteSubscription = (pic) => {
        confirmDialog({
            message: 'Apakah Anda yakin untuk menghapus ini?',
            header: 'Konfirmasi hapus',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept : async ()=> {
                
                destroyPIC('partners/pics/'+pic.uuid, {
                    onSuccess: () => {
                        getPics();
                        showSuccess('Hapus');
                    },
                    onError: () => {
                        showError('Hapus')
                    }
                })
            },
        });
    }

    const renderHeader = () => {
        return (
            <div className="flex flex-row justify-left gap-2 align-items-center items-end">
            <div className="w-[30%]">
                <span className="p-input-icon-left">
                    <i className="pi pi-search dark:text-white" />
                    <InputText className='dark:bg-transparent dark:placeholder-white' value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
            </div>
            
        );
    };

    const header = renderHeader();

    const footerTemplate = () => {
        return (
            <div className="flex shadow-footer justify-between w-full sticky bg-white z-10 py-[5px] bottom-0">
                <Button type='button' icon="pi pi-angle-left" disabled={activeIndex == 0} onClick={() => setActiveIndex(prev => prev-1)} className="bg-purple-600 text-sm shadow-md rounded-lg"/>
                <Button type='submit' label="Submit" disabled={processing || activeIndex !== 2}  className="bg-purple-600 text-sm shadow-md rounded-lg" onClick={() => btnSubmit.current.click()}/>
                <Button type='button' icon="pi pi-angle-right" disabled={activeIndex == 2} onClick={() => setActiveIndex(prev => prev+1)}  className="bg-purple-600 text-sm shadow-md rounded-lg"/>
            </div>
        )
    }

    const addButtonIcon = () => {
        return <i className="pi pi-plus" style={{ fontSize: '0.7rem', paddingRight: '5px' }}></i>
    }

    const handleSubmitForm = (e, type) => {
   
        e.preventDefault();
        
        if(type ==='tambah'){
            
            post('/partners', {
                onSuccess: () => {
                    showSuccess('Tambah');
                    setModalPartnersIsVisible(prev => false);
                    getPartners();
                    reset('partner', 'pic', 'subscription');
                },
                onError: () => {
                    showError('Tambah');
                }    
            });
            
        }else{
        
            put('/partners/'+data.partner.uuid, {
                onSuccess: () => {
                    showSuccess('Update');
                    setModalEditPartnersIsVisible(prev => false);
                    getPartners();
                    reset('partner', 'pic', 'subscription');
                },
                onError: () => {
                    showError('Update');
                }    
            });
        }

        
    }

    const handleSubmitFormPIC = (e, type) => {
   
        e.preventDefault();
        
        if(type ==='tambah'){
            
            postPIC('/partners/pics', {
                onSuccess: () => {
                    showSuccess('Tambah');
                    setModalPicIsVisible(prev => false);
                    getPics();
                    resetPIC('partner', 'name', 'number', 'position', 'address');
                },
                onError: () => {
                    showError('Tambah');
                }    
            });
            
        }else{
        
            putPIC('/partners/pics/'+dataPIC.uuid, {
                onSuccess: () => {
                    showSuccess('Update');
                    setModalEditPicIsVisible(prev => false);
                    getPics();
                    resetPIC('partner', 'name', 'number', 'position', 'address');
                },
                onError: () => {
                    showError('Update');
                }    
            });
        }

        
    }

    if(preRenderLoad)
    {
        return (
            <>
            <DashboardLayout auth={auth.user} className="">
                    <div className="card my-5">
                    <DataTable value={dummyArray} className="p-datatable-striped">
                        <Column style={{ width: '25%' }} body={<Skeleton />}></Column>
                        <Column style={{ width: '25%' }} body={<Skeleton />}></Column>
                        <Column style={{ width: '25%' }} body={<Skeleton />}></Column>
                        <Column style={{ width: '25%' }} body={<Skeleton />}></Column>
                    </DataTable>
                    </div>
                </DashboardLayout>
                </>
        )
    }

    return (
        <DashboardLayout auth={auth.user} className="">
            <Toast ref={toast} />
            <ConfirmDialog />

            <HeaderModule title={activeIndexTab==0 ? "Partner" : null ||  activeIndexTab==1 ? "PIC" : null || activeIndexTab==2 ? "Langganan" : null}>
                
                
                {activeIndexTab==0 && (<Button label="Tambah" className="bg-purple-600 text-sm shadow-md rounded-lg mr-2" icon={addButtonIcon} onClick={() => {
                setModalPartnersIsVisible(prev => prev=true)
                reset('partner')
                }} aria-controls="popup_menu_right" aria-haspopup />)}

                {activeIndexTab==1 && (<Button label="Tambah" className="bg-purple-600 text-sm shadow-md rounded-lg mr-2" icon={addButtonIcon} onClick={() => {
                setModalPicIsVisible(prev => prev=true)
               
                }} aria-controls="popup_menu_right" aria-haspopup />)}
                
            </HeaderModule>

            <TabView className='mt-3' activeIndex={activeIndexTab} onTabChange={(e) => setActiveIndexTab(e.index)}>
                
                <TabPanel header="List Partner">
                     {/* Modal tambah partner */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            ref={modalPartner}
                            header="Partner"
                            headerClassName="dark:glass dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                            contentClassName=' dark:glass dark:text-white'
                            visible={modalPartnersIsVisible}
                            onHide={() => setModalPartnersIsVisible(false)}
                            footer={footerTemplate}
                        >
                        

                            <Steps model={items} activeIndex={activeIndex} className="sticky top-0 bg-white z-10 text-sm"/>

                            <form onSubmit={(e) => handleSubmitForm(e, 'tambah')}>    
                            
                            {/* form partner */}
                            { activeIndex==0 && (
                            <>
                    
                                <div className='flex flex-col justify-around gap-4 mt-4'>
                                    
                                    <div className='flex flex-col'>   
                                        <label htmlFor="name">Nama</label>
                                        <InputText value={data.partner.name} onChange={(e) => setData('partner', {...data.partner, name: e.target.value})} className='dark:bg-gray-300' id="name" aria-describedby="name-help" />
                                    </div>

                                    <div className='flex flex-col'>    
                                        <label htmlFor="sales">Sales</label>
                                        <Dropdown value={data.partner.sales} onChange={(e) => setData('partner',{...data.partner, sales: e.target.value})} options={sales} optionLabel="name" placeholder="Pilih Sales" 
                                        filter valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" />
                                    </div>

                                    <div className='flex flex-col'>    
                                        <label htmlFor="account_manager">Account Manager (AM)</label>
                                        <Dropdown value={data.partner.account_manager} onChange={(e) => setData('partner',{...data.partner, account_manager: e.target.value})} options={account_managers} optionLabel="name" placeholder="Pilih Account Manager (AM)" 
                                        filter valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" />
                                    </div>

                                    <div className='flex flex-col'>
                                        <label htmlFor="register_date">Tanggal Daftar</label>
                                        <Calendar value={data.partner.register_date ? new Date(data.partner.register_date) : null} style={{height:'35px'}} onChange={(e) => {
                                            const formattedDate = new Date(e.target.value).toISOString().split('T')[0];
                                            setData('partner', { ...data.partner, register_date: formattedDate })
                                            }} showIcon dateFormat="yy-mm-dd" />
                                    </div>

                                    <div className='flex flex-col'>
                                        <label htmlFor="live_date">Tanggal Live</label>
                                        <Calendar value={data.partner.live_date ? new Date(data.partner.live_date) : null} style={{height:'35px'}} onChange={(e) => {
                                            const formattedDate = new Date(e.target.value).toISOString().split('T')[0];
                                            setData('partner', { ...data.partner, live_date: formattedDate })
                                            }} showIcon dateFormat="yy-mm-dd"/>
                                    </div>
                
                                    <div className="flex flex-col">
                                        <label htmlFor="status">Status</label>
                                        <Dropdown value={data.partner.status} onChange={(e) => setData('partner', {...data.partner, status: e.target.value})} options={status} optionLabel="name"
                                         placeholder="Pilih Status" className="w-full md:w-14rem" />
                                    </div>

                                    <div className='flex flex-col'>   
                                        <label htmlFor="address">Alamat</label>
                                        <InputTextarea value={data.partner.address} onChange={(e) => setData('partner', {...data.partner, address: e.target.value})} rows={5} cols={30} />
                                    </div>

                                </div>
                                
                            </>    
                            )}

                            {/* form pic */}
                            { activeIndex==1 && (
                            <>
                    
                                <div className='flex flex-col justify-around gap-4 mt-4'>
                                    
                                    <div className='flex flex-col'>   
                                        <label htmlFor="name">Nama</label>
                                        <InputText value={data.pic.name} onChange={(e) => setData('pic',{...data.pic, name: e.target.value})} className='dark:bg-gray-300' id="name" aria-describedby="name-help" />
                                    </div>

                                    {/* <div className='flex flex-col'>   
                                        <label htmlFor="email">Email</label>
                                        <InputText value={data.pic.email} type="email" onChange={(e) => setData('pic',{...data.pic, email: e.target.value})} className='dark:bg-gray-300' id="email" aria-describedby="email-help" />
                                    </div> */}

                                    <div className='flex flex-col'>
                                        <label htmlFor="number">No.Hp</label>
                                        <InputText value={data.pic.number} keyfilter="int" min={0} onChange={(e) => setData('pic',{...data.pic, number: e.target.value})} className='dark:bg-gray-300' id="number" aria-describedby="number-help" />
                                    </div>

                                    <div className='flex flex-col'>   
                                        <label htmlFor="position">Jabatan</label>
                                        <InputText value={data.pic.position} onChange={(e) => setData('pic',{...data.pic, position: e.target.value})} className='dark:bg-gray-300' id="position" aria-describedby="position-help" />
                                    </div>
                                    
                                    <div className='flex flex-col'>   
                                        <label htmlFor="address">Alamat</label>
                                        <InputTextarea value={data.pic.address} onChange={(e) => setData('pic', {...data.pic, address: e.target.value})} rows={5} cols={30} />
                                    </div>

                                </div>
                            
                            </>    
                            )}

                            {/* form langganan */}
                            { activeIndex==2 && (
                            <>
                
                                <div className='flex flex-col justify-around gap-4 mt-4'>
                                    
                                    <div className='flex flex-col'>   
                                        <label htmlFor="nominal">Nominal Langganan</label>
                                        <InputText type="number" inputId="integeronly" value={data.subscription.nominal}  onChange={(e) => setData('subscription',{...data.subscription, nominal: e.target.value})} className='dark:bg-gray-300' id="nominal" aria-describedby="nominal-help" />
                                    </div>

                                    <div className='flex flex-col'>   
                                        <label htmlFor="period">Periode (bulan)</label>
                                        <InputText type="number" value={data.subscription.period} onChange={(e) => setData('subscription',{...data.subscription, period: e.target.value})} className='dark:bg-gray-300' id="period" aria-describedby="period-help" />
                                    </div>

                                    <div className='flex flex-col'>   
                                        <label htmlFor="bank">Bank</label>
                                        <InputText value={data.subscription.bank} onChange={(e) => setData('subscription',{...data.subscription, bank: e.target.value})} className='dark:bg-gray-300' id="bank" aria-describedby="bank-help" />
                                    </div>
                                    
                                    <div className='flex flex-col'>   
                                        <label htmlFor="account_bank_number">Nomor Rekening</label>
                                        <InputText min={1} type="number" value={data.subscription.account_bank_number} onChange={(e) => setData('subscription',{...data.subscription, account_bank_number: e.target.value})} className='dark:bg-gray-300' id="account_bank_number" aria-describedby="account_bank_number-help" />
                                    </div>

                                    <div className='flex flex-col'>   
                                        <label htmlFor="account_bank_name">Atas Nama Rekening</label>
                                        <InputText value={data.subscription.account_bank_name} onChange={(e) => setData('subscription',{...data.subscription, account_bank_name: e.target.value})} className='dark:bg-gray-300' id="account_bank_name" aria-describedby="account_bank_name-help" />
                                    </div>

                                    
                                </div>
                            
                            </>    
                            )}
                            
                            <Button ref={btnSubmit} type='submit' label="Submit" disabled={processing} hidden={true} className="bg-purple-600 text-sm hidden shadow-md rounded-lg"/>
                            </form>
                        </Dialog>
                    </div>

                    {/* Modal edit partner */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            ref={modalPartner}
                            header="Partner"
                            headerClassName="dark:glass shadow-md z-20 dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                            contentClassName=' dark:glass dark:text-white'
                            visible={modalEditPartnersIsVisible}
                            onHide={() => setModalEditPartnersIsVisible(false)}
                        >
                            <form onSubmit={(e) => handleSubmitForm(e, 'update')}>    
                            <div className='flex flex-col justify-around gap-4 mt-4'>
                                    
                                    <div className='flex flex-col'>   
                                        <label htmlFor="name">Nama</label>
                                        <InputText value={data.partner.name} onChange={(e) => setData('partner', {...data.partner, name: e.target.value})} className='dark:bg-gray-300' id="name" aria-describedby="name-help" />
                                    </div>

                                    <div className='flex flex-col'>    
                                        <label htmlFor="sales">Sales</label>                                   
                                        <Dropdown value={data.partner.sales} onChange={(e) => setData('partner',{...data.partner, sales: e.target.value})} options={sales} optionLabel="name" placeholder="Pilih Sales" 
                                        filter valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" />
                                    </div>

                                    <div className='flex flex-col'>    
                                        <label htmlFor="account_manager">Account Manager (AM)</label>
                                        <Dropdown value={data.partner.account_manager} onChange={(e) => setData('partner',{...data.partner, account_manager: e.target.value})} options={account_managers} optionLabel="name" placeholder="Pilih Account Manager (AM)" 
                                        filter valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" />
                                    </div>

                                    <div className='flex flex-col'>
                                        <label htmlFor="register_date">Tanggal Daftar</label>
                                        <Calendar value={data.partner.register_date ? new Date(data.partner.register_date) : null} style={{height:'35px'}} onChange={(e) => {
                                            const formattedDate = new Date(e.target.value).toISOString().split('T')[0];
                                            setData('partner', { ...data.partner, register_date: formattedDate })
                                            }} showIcon dateFormat="yy-mm-dd" />
                                    </div>

                                    <div className='flex flex-col'>
                                        <label htmlFor="live_date">Tanggal Live</label>
                                        <Calendar value={data.partner.live_date ? new Date(data.partner.live_date) : null} style={{height:'35px'}} onChange={(e) => {
                                            const formattedDate = new Date(e.target.value).toISOString().split('T')[0];
                                            setData('partner', { ...data.partner, live_date: formattedDate })
                                            }} showIcon dateFormat="yy-mm-dd"/>
                                    </div>
                
                                    <div className="flex flex-col">
                                        <label htmlFor="status">Status</label>
                                        <Dropdown value={data.partner.status} onChange={(e) => setData('partner', {...data.partner, status: e.target.value})} options={status} optionLabel="name" optionValue="name"
                                         placeholder="Pilih Status" className="w-full md:w-14rem" />
                                    </div>

                                    <div className='flex flex-col'>   
                                        <label htmlFor="address">Alamat</label>
                                        <InputTextarea value={data.partner.address} onChange={(e) => setData('partner', {...data.partner, address: e.target.value})} rows={5} cols={30} />
                                    </div>

                                </div>

                            <div className='flex justify-center mt-5'>
                                <Button
                                    label="Submit" disabled={processing} className="bg-purple-600 text-sm shadow-md rounded-lg"
                                />
                                </div>
                            </form>
                        </Dialog>
                    </div>

                    
                    <div className='flex mx-auto flex-col justify-center mt-5 gap-5'>
                        <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                        <DataTable
                            loading={isLoadingData}
                            className="w-full h-auto rounded-lg dark:glass border-none text-center shadow-md" 
                            pt={{
                                bodyRow: 'dark:bg-transparent bg-transparent dark:text-gray-300',
                                table: 'dark:bg-transparent bg-white dark:text-gray-300',
                                header: ''
                            }}
                            paginator 
                            rows={5}
                            filters={filters}
                            globalFilterFields={['name', 'sales.name', 'account_manager.name']}
                            emptyMessage="Partner tidak ditemukan."
                            paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                            header={header}
                            value={partners} dataKey="id" >
                                <Column header="No" body={(_, { rowIndex }) => rowIndex + 1} className='dark:border-none pl-6' headerClassName='dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300' style={{ width:'3%' }}/>
                                <Column field="name" className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Nama" align='left' style={{ width: '10%' }}></Column>
                                <Column field="uuid" hidden className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Nama" align='left' style={{ width: '10%' }}></Column>
                                <Column header="Sales" body={(rowData) => rowData.sales.name } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '10%' }}></Column>
                                <Column header="Account Manager" body={(rowData) => rowData.account_manager.name } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '10%' }}></Column>
                                <Column header="Tanggal daftar" body={(rowData) => new Date(rowData.register_date).toLocaleDateString("id")} className='dark:border-none' headerClassName='dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '10%' }}></Column>
                                <Column header="Tanggal live" body={(rowData) => new Date(rowData.live_date).toLocaleDateString("id")} className='dark:border-none' headerClassName='dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '10%' }}></Column>
                                <Column field="address" className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Alamat" align='left' style={{ width: '20%' }}></Column>
                                <Column header="Status" body={(rowData) => {
                                    return <Badge value={rowData.status} className="text-white" severity={rowData.status == 'Aktif' ? 'success' : null || rowData.status == 'CLBK' ? 'info' : null || rowData.status == 'Proses' ? 'warning' : null || rowData.status == 'Non Aktif' ? 'danger' : null}></Badge>
                                }} className='dark:border-none' headerClassName='dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '10%' }}></Column>
                                <Column header="Action" body={actionBodyTemplate} style={{ width:'10%' }} className='dark:border-none' headerClassName='dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300'></Column>
                            </DataTable>
                        </div>

                    </div>
                </TabPanel>

                <TabPanel header="PIC">

                    {/* Modal tambah pic */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            header="PIC"
                            headerClassName="dark:glass dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                            contentClassName='dark:glass dark:text-white'
                            visible={modalPicIsVisible}
                            onHide={() => setModalPicIsVisible(false)}
                        >

                            <form onSubmit={(e) => handleSubmitFormPIC(e, 'tambah')}>    
                    
                    
                            <div className='flex flex-col justify-around gap-4 mt-4'>
                                
                                <div className='flex flex-col'>   
                                    <label htmlFor="name">Nama</label>
                                    <InputText value={dataPIC.name} onChange={(e) => setDataPIC('name', e.target.value)} className='dark:bg-gray-300' id="name" aria-describedby="name-help" />
                                </div>

                                <div className='flex flex-col'>    
                                    <label htmlFor="pic_partner">Partner</label>
                                    <Dropdown optionLabel="name" value={dataPIC.partner} onChange={(e) => setDataPIC('partner', e.target.value)} options={partners} placeholder="Pilih Partner" 
                                    filter valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" />
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="number">No.Hp</label>
                                    <InputText keyfilter="int" min={0} value={dataPIC.number} onChange={(e) => setDataPIC('number', e.target.value)} className='dark:bg-gray-300' id="number" aria-describedby="number-help" />
                                </div>

                                <div className='flex flex-col'>   
                                    <label htmlFor="position">Jabatan</label>
                                    <InputText value={dataPIC.position} onChange={(e) => setDataPIC('position', e.target.value)} className='dark:bg-gray-300' id="position" aria-describedby="position-help" />
                                </div>
                                
                                <div className='flex flex-col'>   
                                    <label htmlFor="address">Alamat</label>
                                    <InputTextarea value={dataPIC.address} onChange={(e) => setDataPIC('address', e.target.value)} rows={5} cols={30} />
                                </div>

                            </div>
                            <div className='flex justify-center mt-5'>
                                <Button label="Submit" disabled={processingPIC} className="bg-purple-600 text-sm shadow-md rounded-lg"/>
                            </div>

                            </form>
                        </Dialog>
                    </div>

                    {/* Modal edit pic */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            header="Edit PIC"
                            headerClassName="dark:glass shadow-md z-20 dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                            contentClassName=' dark:glass dark:text-white'
                            visible={modalEditPicIsVisible}
                            onHide={() => setModalEditPicIsVisible(false)}
                        >
                            <form onSubmit={(e) => handleSubmitFormPIC(e, 'update')}>    
                            <div className='flex flex-col justify-around gap-4 mt-4'>
                                
                                <div className='flex flex-col'>   
                                    <label htmlFor="name">Nama</label>
                                    <InputText value={dataPIC.name} onChange={(e) => setDataPIC('name', e.target.value)} className='dark:bg-gray-300' id="name" aria-describedby="name-help" />
                                </div>

                                <div className='flex flex-col'>    
                                    <label htmlFor="pic_partner">Partner</label>
                                   
                                    <Dropdown value={dataPIC.partner} options={partners} onChange={(e) => setDataPIC('partner',  e.target.value)} optionLabel="name" placeholder="Pilih Partner" 
                                    filter valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" />
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="number">No.Hp</label>
                                    <InputText keyfilter="int" min={0} value={dataPIC.number} onChange={(e) => setDataPIC('number', e.target.value)} className='dark:bg-gray-300' id="number" aria-describedby="number-help" />
                                </div>

                                <div className='flex flex-col'>   
                                    <label htmlFor="position">Jabatan</label>
                                    <InputText value={dataPIC.position} onChange={(e) => setDataPIC('position', e.target.value)} className='dark:bg-gray-300' id="position" aria-describedby="position-help" />
                                </div>
                                
                                <div className='flex flex-col'>   
                                    <label htmlFor="address">Alamat</label>
                                    <InputTextarea value={dataPIC.address} onChange={(e) => setDataPIC('address', e.target.value)} rows={5} cols={30} />
                                </div>

                            </div>

                            <div className='flex justify-center mt-5'>
                                <Button
                                    label="Submit" disabled={processing} className="bg-purple-600 text-sm shadow-md rounded-lg"
                                />
                                </div>
                            </form>
                        </Dialog>
                    </div>

                    <div className='flex mx-auto flex-col justify-center mt-5 gap-5'>
                        <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                        <DataTable
                            loading={isLoadingData}
                            className="w-full h-auto rounded-lg dark:glass border-none text-center shadow-md" 
                            pt={{
                                bodyRow: 'dark:bg-transparent bg-transparent dark:text-gray-300',
                                table: 'dark:bg-transparent bg-white dark:text-gray-300',
                                header: ''
                            }}
                            paginator 
                            rows={5}
                            emptyMessage="Partner tidak ditemukan."
                            paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                            header={header}
                            filters={filters}
                            globalFilterFields={['name', 'partner.name']}
                            value={pics} dataKey="id" >
                                <Column header="No" body={(_, { rowIndex }) => rowIndex + 1} className='dark:border-none pl-6' headerClassName='dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300' style={{ width:'3%' }}/>
                                <Column field="name" header="PIC" className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column header="Partner" body={(rowData) => rowData.partner.name } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column field="uuid" hidden className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Nama" align='left'></Column>
                                <Column field="number" header="Nomor Handphone" className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column field="position" header="Jabatan" className='dark:border-none' headerClassName='dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column field="address" className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Alamat" align='left' style={{ width: '20%' }}></Column>
                                <Column header="Action" body={actionBodyTemplatePIC} style={{ width:'10%' }} className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300'></Column>
                            </DataTable>
                        </div>

                    </div>

                </TabPanel>

                <TabPanel header="Langganan">
                <div className='flex mx-auto flex-col justify-center mt-5 gap-5'>
                        <div className="card p-fluid w-full h-full flex justify-center rounded-lg">
                        
                        <DataTable
                            loading={isLoadingData}
                            className="w-full h-auto rounded-lg dark:glass border-none text-center shadow-md" 
                            pt={{
                                bodyRow: 'dark:bg-transparent bg-transparent dark:text-gray-300',
                                table: 'dark:bg-transparent bg-white dark:text-gray-300',
                                header: ''
                            }}
                            paginator 
                            rows={5}
                            emptyMessage="Langganan partner tidak ditemukan."
                            paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                            header={header}
                            filters={filters}
                            globalFilterFields={['partner.name','period']}
                            value={subscriptions} dataKey="id" >
                                <Column header="No" body={(_, { rowIndex }) => rowIndex + 1} className='dark:border-none pl-6' headerClassName='dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300' style={{ width:'3%' }}/>
                                <Column header="Partner" body={(rowData) => rowData.partner.name } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column field="nominal" header="Nominal" className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column field="uuid" hidden className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Nama" align='left'></Column>
                                <Column field="bank" header="Bank" className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column field="account_bank_number" header="Nomor Rekening" className='dark:border-none' headerClassName='dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column field="account_bank_name" header="Atas Nama" className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300'  align='left' style={{ width: '20%' }}></Column>
                                <Column header="Action" body={actionBodyTemplateSubscriptipn} style={{ width:'10%' }} className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300'></Column>
                            </DataTable>
                            
                        </div>
                    </div>
                </TabPanel>
            </TabView>

           
         
        </DashboardLayout>
    );
}
        