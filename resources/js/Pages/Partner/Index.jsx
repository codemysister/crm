
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
import { SelectButton } from 'primereact/selectbutton';
import { Menu } from 'primereact/menu';
import { Fieldset } from 'primereact/fieldset';
import { Tooltip } from 'primereact/tooltip';
import { Card } from 'primereact/card';

export default function Index({auth}) {
    const [partners, setPartners] = useState('');
    const [pics, setPics] = useState('');
    const [sales, setSales] = useState('');
    const [banks, setBanks] = useState('');
    const [subscriptions, setSubscriptions] = useState('');
    const [account_managers, setAccountManagers] = useState('');
    const [activeIndexTab, setActiveIndexTab] = useState(0);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [modalPartnersIsVisible, setModalPartnersIsVisible] = useState(false);
    const [modalEditPartnersIsVisible, setModalEditPartnersIsVisible] = useState(false);
    const [modalPicIsVisible, setModalPicIsVisible] = useState(false);
    const [modalEditPicIsVisible, setModalEditPicIsVisible] = useState(false);
    const [modalBankIsVisible, setModalBankIsVisible] = useState(false);
    const [modalEditBankIsVisible, setModalEditBankIsVisible] = useState(false);
    const [modalSubscriptionIsVisible, setModalSubscriptionIsVisible] = useState(false);
    const [modalEditSubscriptionIsVisible, setModalEditSubscriptionIsVisible] = useState(false);
    const toast = useRef(null);
    const btnSubmit = useRef(null);
    const modalPartner = useRef(null);
    const {roles, permissions} = auth.user;
    const [activeIndex, setActiveIndex] = useState(0);
    const dummyArray = Array.from({ length: 5 }, (v, i) => i);
    const [preRenderLoad, setPreRenderLoad] = useState(true);
    const [inputPriceCard, setInputPriceCard] = useState(false); 
    const [inputPriceLanyard, setInputPriceLanyard] = useState(false); 
    const [inputPriceSubscriptionSystem, setInputPriceSubscriptionSystem] = useState(false); 
    const [inputPriceTraining, setInputPriceTraining] = useState(false); 
    const [selectedDetailPartner, setSelectedDetailPartner] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [activeMenu, setActiveMenu] = useState('lembaga');
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
        bank: {
            bank: '',
            account_bank_number: '',
            account_bank_name: ''
        },
        subscription: {
            nominal: 0,
            period: 1,
            price_card: {
                price: '',
                type: ''
            },
            price_training: {
                price: '',
                type: ''
            },
            price_lanyard: '',
            price_subscription_system: '',
            price_training: {
                price: '',
                type: ''
            }
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

    const { data: dataBank, setData: setDataBank, post: postBank, put: putBank, delete: destroyBank, reset: resetBank, processing: processingBank, errors:errorBank }  = useForm({
        uuid:'',
        partner: {},
        bank: '',
        account_bank_number: '',
        account_bank_name: ''
    })

    const { data: dataSubscription, setData: setDataSubscription, post: postSubscription, put: putSubscription, delete: destroySubscription, reset: resetSubscription, processing: processingSubscription, errors:errorSubscription }  = useForm({
        uuid:'',
        partner: {},
        nominal: '',
        period: '',
        price_card: {
            price: '',
            type: ''
        },
        price_training: {
            price: '',
            type: ''
        },
        price_lanyard: '',
        price_subscription_system: '',
        price_training: {
            price: '',
            type: ''
        }
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

    const getBanks = async () => {
        setIsLoadingData(true)
        
        let response = await fetch('/api/partners/banks');
        let data = await response.json();
   
        setBanks(prev => data);
       
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
                if(activeIndexTab == 0){
                    await getPartners()
                    setPreRenderLoad(prev => prev=false)
                }else if(activeIndexTab == 1){
                    await getPics()
                }else if(activeIndexTab == 2){
                    await getBanks()
                }else if(activeIndexTab == 3){
                    await getSubscriptions()
                }else{
                    await getPartners()
                }
              
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      
          fetchData();
    }, [activeIndexTab])

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => handleEditPartner(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => {handleDeletePartner(rowData)}} />
            </React.Fragment>
        );
    };

    const actionBodyTemplateBank = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => handleEditBank(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => {handleDeleteBank(rowData)}} />
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

    let cardCategories = [
        {name: 'digital'},
        {name: 'cetak'},
    ]

    let trainingCategories = [
        {name: 'offline'},
        {name: 'online'},
    ]

    const items = [
        {
            label: 'Lembaga',
        },
        {
            label: 'PIC'
        },
        {
            label: 'Bank'
        },
        {
            label: 'Langganan'
        }
    ];

    let menuDetailPartnerItems = [
        {
            label: 'Lembaga', 
            className: `${activeMenu=="lembaga" ? "p-menuitem-active" : ''}`,
            command: () => {
                setActiveMenu(prev => prev='lembaga');
            }
        },
        {
            label: 'PIC', 
            className: `${activeMenu=="pic" ? "p-menuitem-active" : ''}`,
            command: () => {
                setActiveMenu(prev => prev='pic');
            }
        },
        {
            label: 'Bank', 
            className: `${activeMenu=="bank" ? "p-menuitem-active" : ''}`,
            command: () => {
                setActiveMenu(prev => prev='bank');
            }
        },
        {
            label: 'Langganan', 
            className: `${activeMenu=="langganan" ? "p-menuitem-active" : ''}`,
            command: () => {
                setActiveMenu(prev => prev='langganan');
            }
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

    const handleEditBank = (bank) => {
       
        setDataBank(data => ({ ...data, uuid: bank.uuid}));
        setDataBank(data => ({ ...data, partner: bank.partner}));
        setDataBank(data => ({ ...data, bank: bank.bank}));
        setDataBank(data => ({ ...data, account_bank_number: bank.account_bank_number}));
        setDataBank(data => ({ ...data, account_bank_name: bank.account_bank_name}));
        
        setModalEditBankIsVisible(true);
    };

    const handleDeleteBank = (bank) => {
        confirmDialog({
            message: 'Apakah Anda yakin untuk menghapus ini?',
            header: 'Konfirmasi hapus',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept : async ()=> {
                
                destroyBank('partners/banks/'+bank.uuid, {
                    onSuccess: () => {
                        getBanks();
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

    const handleEditSubscription = (subscription) => {
        setDataSubscription(data => ({ ...data, uuid: subscription.uuid}));
        setDataSubscription(data => ({ ...data, partner: subscription.partner}));
        setDataSubscription(data => ({ ...data, nominal: subscription.nominal}));
        setDataSubscription(data => ({ ...data, period: subscription.period}));
        setDataSubscription(data => ({ ...data, price_card: JSON.parse(subscription.price_card) }));
        setDataSubscription(data => ({ ...data, price_lanyard: subscription.price_lanyard}));
        setDataSubscription(data => ({ ...data, price_subscription_system: subscription.price_subscription_system}));
        setDataSubscription(data => ({ ...data, price_training: JSON.parse(subscription.price_training) }));

        setModalEditSubscriptionIsVisible(true);
        console.log(dataSubscription);
    };

    const handleDeleteSubscription = (subscription) => {
        confirmDialog({
            message: 'Apakah Anda yakin untuk menghapus ini?',
            header: 'Konfirmasi hapus',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept : async ()=> {
                
                destroySubscription('partners/subscriptions/'+subscription.uuid, {
                    onSuccess: () => {
                        getSubscriptions();
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
                <Button type='submit' label="Submit" disabled={processing || activeIndex !== 3}  className="bg-purple-600 text-sm shadow-md rounded-lg" onClick={() => btnSubmit.current.click()}/>
                <Button type='button' icon="pi pi-angle-right" disabled={activeIndex == 3} onClick={() => setActiveIndex(prev => prev+1)}  className="bg-purple-600 text-sm shadow-md rounded-lg"/>
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

        setActiveIndex(prev=prev=0)
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

    const handleSubmitFormBank = (e, type) => {
   
        e.preventDefault();
        
        if(type ==='tambah'){
            
            postBank('/partners/banks', {
                onSuccess: () => {
                    showSuccess('Tambah');
                    setModalBankIsVisible(prev => false);
                    getBanks();
                    resetBank('partner', 'bank', 'account_bank_number', 'account_bank_name');
                },
                onError: () => {
                    showError('Tambah');
                }    
            });
            
        }else{
        
            putBank('/partners/banks/'+dataBank.uuid, {
                onSuccess: () => {
                    showSuccess('Update');
                    setModalEditBankIsVisible(prev => false);
                    getBanks();
                    resetBank('partner', 'bank', 'account_bank_number', 'account_bank_name');
                },
                onError: () => {
                    showError('Update');
                }    
            });
        }

        
    }

    const handleSubmitFormSubscription = (e, type) => {
   
        e.preventDefault();
        
        if(type ==='tambah'){

            postSubscription('/partners/subscriptions', {
                onSuccess: () => {
                    showSuccess('Tambah');
                    setModalSubscriptionIsVisible(prev => prev = false);
                    getSubscriptions();
                    resetSubscription('partner', 'nominal', 'period', 'bank', 'account_bank_number', 'account_bank_name');
                },
                onError: () => {
                    showError('Tambah');
                }    
            });
            
        }else{
        
            putSubscription('/partners/subscriptions/'+dataSubscription.uuid, {
                onSuccess: () => {
                    showSuccess('Update');
                    setModalEditSubscriptionIsVisible(prev => prev = false);
                    getSubscriptions();
                    resetSubscription('partner', 'nominal', 'period', 'bank', 'account_bank_number', 'account_bank_name');
                },
                onError: () => {
                    showError('Update');
                }    
            });
        }

        
    }

    const handleSelectedDetailPartner = (partner) => {
        setSelectedDetailPartner(partner)
        setActiveIndexTab(prev=>prev=4)
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

    const headerFieldsetPartner = (
        
        <div className="flex tooltip-partner justify-center items-center">
            Partner
        </div>
    )
    


    return (
        <DashboardLayout auth={auth.user} className="">
            <Toast ref={toast} />
            <ConfirmDialog />

            <HeaderModule title={activeIndexTab==0 ? "Partner" : null ||  activeIndexTab==1 ? "PIC" : null || activeIndexTab==2 ? "Bank" : null || activeIndexTab==3 ? "Langganan" : null || activeIndexTab == 4 ? "Detail Partner" : null}>
                
                {activeIndexTab==0 && (<Button label="Tambah" className="bg-purple-600 text-sm shadow-md rounded-lg mr-2" icon={addButtonIcon} onClick={() => {
                setModalPartnersIsVisible(prev => prev=true)
                reset('partner')
                }} aria-controls="popup_menu_right" aria-haspopup />)}

                {activeIndexTab == 1 && (<Button label="Tambah" className="bg-purple-600 text-sm shadow-md rounded-lg mr-2" icon={addButtonIcon} onClick={() => {
                setModalPicIsVisible(prev => prev=true)
                }} aria-controls="popup_menu_right" aria-haspopup />)}

                {activeIndexTab == 2 && (<Button label="Tambah" className="bg-purple-600 text-sm shadow-md rounded-lg mr-2" icon={addButtonIcon} onClick={() => {
                setModalBankIsVisible(prev => prev=true)
                }} aria-controls="popup_menu_right" aria-haspopup />)}

                {activeIndexTab == 3 && (<Button label="Tambah" className="bg-purple-600 text-sm shadow-md rounded-lg mr-2" icon={addButtonIcon} onClick={() => {
                setModalSubscriptionIsVisible(prev => prev=true)
                }} aria-controls="popup_menu_right" aria-haspopup />)}

                {activeIndexTab == 4 && (<Button label="Tambah" className="bg-purple-600 text-sm shadow-md rounded-lg mr-2" icon={addButtonIcon} onClick={() => {
                setModalSubscriptionIsVisible(prev => prev=true)
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
                    
                                <div className='flex flex-col justify-around gap-4 mt-1'>
                                    
                                    <div className='flex flex-col'>   
                                        <label htmlFor="name">Nama *</label>
                                        <InputText value={data.partner.name} onChange={(e) => setData('partner', {...data.partner, name: e.target.value})} className='dark:bg-gray-300' id="name" aria-describedby="name-help" />
                                    </div>

                                    <div className='flex flex-col'>    
                                        <label htmlFor="sales">Sales *</label>
                                        <Dropdown value={data.partner.sales} onChange={(e) => setData('partner',{...data.partner, sales: e.target.value})} options={sales} optionLabel="name" placeholder="Pilih Sales" 
                                        filter valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" />
                                    </div>

                                    <div className='flex flex-col'>    
                                        <label htmlFor="account_manager">Account Manager (AM) *</label>
                                        <Dropdown value={data.partner.account_manager} onChange={(e) => setData('partner',{...data.partner, account_manager: e.target.value})} options={account_managers} optionLabel="name" placeholder="Pilih Account Manager (AM)" 
                                        filter valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" />
                                    </div>

                                    <div className='flex flex-col'>
                                        <label htmlFor="register_date">Tanggal Daftar *</label>
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
                                        <label htmlFor="status">Status *</label>
                                        <Dropdown value={data.partner.status} onChange={(e) => setData('partner', {...data.partner, status: e.target.value})} options={status} optionLabel="name"
                                         placeholder="Pilih Status" className="w-full md:w-14rem" />
                                    </div>

                                    <div className='flex flex-col'>   
                                        <label htmlFor="address">Alamat *</label>
                                        <InputTextarea value={data.partner.address} onChange={(e) => setData('partner', {...data.partner, address: e.target.value})} rows={5} cols={30} />
                                    </div>

                                </div>
                                
                            </>    
                            )}

                            {/* form pic */}
                            { activeIndex==1 && (
                            <>
                    
                                <div className='flex flex-col justify-around gap-4 mt-1'>
                                    
                                    <div className='flex flex-col'>   
                                        <label htmlFor="name">Nama *</label>
                                        <InputText value={data.pic.name} onChange={(e) => setData('pic',{...data.pic, name: e.target.value})} className='dark:bg-gray-300' id="name" aria-describedby="name-help" />
                                    </div>

                                    {/* <div className='flex flex-col'>   
                                        <label htmlFor="email">Email</label>
                                        <InputText value={data.pic.email} type="email" onChange={(e) => setData('pic',{...data.pic, email: e.target.value})} className='dark:bg-gray-300' id="email" aria-describedby="email-help" />
                                    </div> */}

                                    <div className='flex flex-col'>
                                        <label htmlFor="number">No.Hp *</label>
                                        <InputText value={data.pic.number} keyfilter="int" min={0} onChange={(e) => setData('pic',{...data.pic, number: e.target.value})} className='dark:bg-gray-300' id="number" aria-describedby="number-help" />
                                    </div>

                                    <div className='flex flex-col'>   
                                        <label htmlFor="position">Jabatan *</label>
                                        <InputText value={data.pic.position} onChange={(e) => setData('pic',{...data.pic, position: e.target.value})} className='dark:bg-gray-300' id="position" aria-describedby="position-help" />
                                    </div>
                                    
                                    <div className='flex flex-col'>   
                                        <label htmlFor="address">Alamat *</label>
                                        <InputTextarea value={data.pic.address} onChange={(e) => setData('pic', {...data.pic, address: e.target.value})} rows={5} cols={30} />
                                    </div>

                                </div>
                            
                            </>    
                            )}

                            {/* form bank */}
                            { activeIndex==2 && (
                            <>
                    
                                <div className='flex flex-col justify-around gap-4 mt-4'>
                                    
                                    <div className='flex flex-col'>   
                                        <label htmlFor="bank">Bank *</label>
                                        <InputText value={data.bank.bank} onChange={(e) => setData('bank', {...data.bank, bank: e.target.value} )} className='dark:bg-gray-300' id="bank" aria-describedby="bank-help" />
                                    </div>
                                    
                                    <div className='flex flex-col'>   
                                        <label htmlFor="account_bank_number">Nomor Rekening *</label>
                                        <InputText value={data.bank.account_bank_number} onChange={(e) => setData('bank', {...data.bank, account_bank_number: e.target.value} )} className='dark:bg-gray-300' id="account_bank_number" aria-describedby="account_bank_number-help" />
                                    </div>

                                    <div className='flex flex-col'>   
                                        <label htmlFor="account_bank_name">Atas Nama *</label>
                                        <InputText value={data.bank.account_bank_name} onChange={(e) => setData('bank', {...data.bank, account_bank_name: e.target.value} )} className='dark:bg-gray-300' id="account_bank_name" aria-describedby="account_bank_name-help" />
                                    </div>

                                </div>
                            
                            </>    
                            )}

                            {/* form langganan */}
                            { activeIndex==3 && (
                            <>
                
                                <div className='flex flex-col justify-around gap-4 mt-1'>
                                    
                                    <div className='flex flex-col'>   
                                        <label htmlFor="nominal">Nominal Langganan *</label>
                                        <InputNumber value={data.subscription.nominal} onValueChange={(e) => setData('subscription',{...data.subscription, nominal: e.target.value})} locale="id-ID" />
                                    </div>

                                    <div className='flex flex-col'>   
                                        <label htmlFor="period">Periode (bulan) *</label>
                                        <InputText keyfilter="int" value={data.subscription.period} onChange={(e) => setData('subscription',{...data.subscription, period: e.target.value})} className='dark:bg-gray-300' id="period" aria-describedby="period-help" />
                                    </div>

                                    <div className='flex flex-col'> 
                                        <div className="flex justify-center">
                                            { !inputPriceCard && (
                                                <Button label="Input Tarif Kartu" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceCard(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                            )}
                                        </div>  

                                        { inputPriceCard && (
                                            <>
                                            <label htmlFor="price_card">Tarif Kartu</label>

                                            <div className="flex justify-between gap-1 w-full items-center">
                                                <div className='w-[95%] flex gap-2 h-full'>
                                                    <InputNumber placeholder='tarif' value={data.subscription.price_card.price} onValueChange={(e) => setData('subscription',{...data.subscription, price_card : { ...data.subscription.price_card, price: e.target.value}})} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale="id-ID"/>
                                                    <Dropdown value={data.subscription.price_card.type} onChange={(e) => setData('subscription',{...data.subscription, price_card : { ...data.subscription.price_card, type: e.target.value}})} options={cardCategories} optionLabel="name" 
                                                    placeholder="kategori" className="w-full md:w-14rem" />
                                                </div>
                                                <div className='h-full flex items-center'>
                                                <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceCard(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                                </div>

                                            </div>
                                            </>
                                        
                                        )}

                                    </div>
                                    
                                    <div className='flex flex-col'> 
                                        <div className="flex justify-center">
                                            { !inputPriceLanyard && (
                                                <Button label="Input Tarif Lanyard" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceLanyard(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                            )}
                                        </div>  

                                        { inputPriceLanyard && (
                                            <>
                                            <label htmlFor="price_card">Tarif Lanyard</label>

                                            <div className="flex justify-between gap-1 w-full items-center">
                                                <div className='w-[95%] flex gap-2 h-full'>
                                                    <InputNumber placeholder='tarif' value={data.subscription.price_lanyard} onValueChange={(e) => setData('subscription',{...data.subscription, price_lanyard:  e.target.value})} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale="id-ID" />
                                                </div>
                                                <div className='h-full flex items-center'>
                                                <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceLanyard(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                                </div>

                                            </div>
                                            </>
                                        
                                        )}
                                    </div>

                                    <div className='flex flex-col'> 
                                        <div className="flex justify-center">
                                            { !inputPriceSubscriptionSystem && (
                                                <Button label="Input Tarif Langganan Sistem" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceSubscriptionSystem(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                            )}
                                        </div>  

                                        { inputPriceSubscriptionSystem && (
                                            <>
                                            <label htmlFor="price_card">Tarif Langganan Sistem</label>

                                            <div className="flex justify-between gap-1 w-full items-center">
                                                <div className='w-[95%] flex gap-2 h-full'>
                                                    <InputNumber placeholder='tarif' value={data.subscription.price_subscription_system} onValueChange={(e) => setData('subscription',{...data.subscription, price_subscription_system: e.target.value})} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale='id-ID' />
                                                </div>
                                                <div className='h-full flex items-center'>
                                                <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceSubscriptionSystem(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                                </div>

                                            </div>
                                            </>
                                        
                                        )}
                                    </div>

                                    <div className='flex flex-col'> 
                                        <div className="flex justify-center">
                                            { !inputPriceTraining && (
                                                <Button label="Input Tarif Langganan Sistem" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceTraining(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                            )}
                                        </div>  

                                        { inputPriceTraining && (
                                            <>
                                            <label htmlFor="price_card">Tarif Pelatihan</label>

                                            <div className="flex justify-between gap-1 w-full items-center">
                                                <div className='w-[95%] flex gap-2 h-full'>
                                                    <InputNumber placeholder='tarif' value={data.subscription.price_training.price} onValueChange={(e) => setData('subscription',{...data.subscription, price_training : { ...data.subscription.price_training, price: e.target.value}})} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale='id-ID' />
                                                    <Dropdown value={data.subscription.price_training.type} onChange={(e) => setData('subscription',{...data.subscription, price_training : { ...data.subscription.price_training, type: e.target.value}})} options={trainingCategories} optionLabel="name" 
                                                    placeholder="kategori" className="w-full md:w-14rem" />
                                                </div>
                                                <div className='h-full flex items-center'>
                                                <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceTraining(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                                </div>

                                            </div>
                                            </>
                                        )}
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
                                <Column header="Nama" body={(rowData) => <button onClick={ () => handleSelectedDetailPartner(rowData)} className='hover:text-blue-700'>{rowData.name}</button>} className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '10%' }}></Column>
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
                                    label="Submit" disabled={processingPIC} className="bg-purple-600 text-sm shadow-md rounded-lg"
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
                                <Column header="Partner" body={(rowData) => <button onClick={ () => handleSelectedDetailPartner(rowData.partner)} className='hover:text-blue-700'>{rowData.partner.name}</button>} className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column field="uuid" hidden className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Nama" align='left'></Column>
                                <Column field="number" header="Nomor Handphone" className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column field="position" header="Jabatan" className='dark:border-none' headerClassName='dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column field="address" className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Alamat" align='left' style={{ width: '20%' }}></Column>
                                <Column header="Action" body={actionBodyTemplatePIC} style={{ width:'10%' }} className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300'></Column>
                            </DataTable>
                        </div>
                                
                    </div>

                </TabPanel>

                <TabPanel header="Bank">

                    {/* Modal tambah bank */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            header="Bank"
                            headerClassName="dark:glass dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                            contentClassName='dark:glass dark:text-white'
                            visible={modalBankIsVisible}
                            onHide={() => setModalBankIsVisible(false)}
                        >

                            <form onSubmit={(e) => handleSubmitFormBank(e, 'tambah')}>    
                    
                    
                            <div className='flex flex-col justify-around gap-4 mt-4'>
                                
                                <div className='flex flex-col'>    
                                    <label htmlFor="partner_subcription">Partner</label>
                                    <Dropdown optionLabel="name" value={dataBank.partner} onChange={(e) => setDataBank('partner', e.target.value)} options={partners} placeholder="Pilih Partner" 
                                    filter valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" />
                                </div>

                                <div className='flex flex-col'>   
                                    <label htmlFor="bank">Bank</label>
                                    <InputText value={dataBank.bank} onChange={(e) => setDataBank('bank', e.target.value)} className='dark:bg-gray-300' id="bank" aria-describedby="bank-help" />
                                </div>
                                
                                <div className='flex flex-col'>   
                                    <label htmlFor="account_bank_number">Nomor Rekening</label>
                                    <InputText value={dataBank.account_bank_number} onChange={(e) => setDataBank('account_bank_number', e.target.value)} className='dark:bg-gray-300' id="account_bank_number" aria-describedby="account_bank_number-help" />
                                </div>

                                <div className='flex flex-col'>   
                                    <label htmlFor="account_bank_name">Atas Nama</label>
                                    <InputText value={dataBank.account_bank_name} onChange={(e) => setDataBank('account_bank_name', e.target.value )} className='dark:bg-gray-300' id="account_bank_name" aria-describedby="account_bank_name-help" />
                                </div>
                           
                            </div>
                            <div className='flex justify-center mt-5'>
                                <Button label="Submit" disabled={processingBank} className="bg-purple-600 text-sm shadow-md rounded-lg"/>
                            </div>

                            </form>
                        </Dialog>
                    </div>

                    {/* Modal edit bank */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            header="Bank"
                            headerClassName="dark:glass dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                            contentClassName='dark:glass dark:text-white'
                            visible={modalEditBankIsVisible}
                            onHide={() => setModalEditBankIsVisible(false)}
                        >

                            <form onSubmit={(e) => handleSubmitFormBank(e, 'update')}>    
                    
                    
                            <div className='flex flex-col justify-around gap-4 mt-4'>
                                
                            <div className='flex flex-col'>    
                                    <label htmlFor="partner_subcription">Partner</label>
                                    <Dropdown optionLabel="name" value={dataBank.partner} onChange={(e) => setDataBank('partner', e.target.value)} options={partners} placeholder="Pilih Partner" 
                                    filter valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" />
                                </div>

                                <div className='flex flex-col'>   
                                    <label htmlFor="bank">Bank</label>
                                    <InputText value={dataBank.bank} onChange={(e) => setDataBank('bank', e.target.value)} className='dark:bg-gray-300' id="bank" aria-describedby="bank-help" />
                                </div>
                                
                                <div className='flex flex-col'>   
                                    <label htmlFor="account_bank_number">Nomor Rekening</label>
                                    <InputText value={dataBank.account_bank_number} onChange={(e) => setDataBank('account_bank_number', e.target.value)} className='dark:bg-gray-300' id="account_bank_number" aria-describedby="account_bank_number-help" />
                                </div>

                                <div className='flex flex-col'>   
                                    <label htmlFor="account_bank_name">Atas Nama</label>
                                    <InputText value={dataBank.account_bank_name} onChange={(e) => setDataBank('account_bank_name', e.target.value )} className='dark:bg-gray-300' id="account_bank_name" aria-describedby="account_bank_name-help" />
                                </div>
                           
                            </div>
                            <div className='flex justify-center mt-5'>
                                <Button label="Submit" disabled={processingBank} className="bg-purple-600 text-sm shadow-md rounded-lg"/>
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
                            emptyMessage="Langganan partner tidak ditemukan."
                            paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                            header={header}
                            filters={filters}
                            globalFilterFields={['partner.name','account_bank_name']}
                            value={banks} dataKey="id" >
                                <Column header="No" body={(_, { rowIndex }) => rowIndex + 1} className='dark:border-none pl-6' headerClassName='dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300' style={{ width:'3%' }}/>
                                <Column header="Partner" body={(rowData) => <button onClick={ () => handleSelectedDetailPartner(rowData.partner)} className='hover:text-blue-700'>{rowData.partner.name}</button>} className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column field="uuid" hidden className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Nama" align='left'></Column>
                                <Column field="account_bank_name" header="Atas Nama" className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300'  align='left' style={{ width: '10%' }}></Column>
                                <Column field="bank" header="Bank" className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '10%' }}></Column>
                                <Column field="account_bank_number" header="Nomor Rekening" className='dark:border-none' headerClassName='dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column header="Action" body={actionBodyTemplateBank} style={{ width:'10%' }} className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300'></Column>
                            </DataTable>
                            
                        </div>
                    </div>
                    
                </TabPanel>

                <TabPanel header="Langganan">

                    {/* Modal tambah langganan */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            header="Langganan"
                            headerClassName="dark:glass dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                            contentClassName='dark:glass dark:text-white'
                            visible={modalSubscriptionIsVisible}
                            onHide={() => setModalSubscriptionIsVisible(false)}
                        >

                            <form onSubmit={(e) => handleSubmitFormSubscription(e, 'tambah')}>    
                    
                    
                            <div className='flex flex-col justify-around gap-4 mt-4'>
                                
                                <div className='flex flex-col'>    
                                    <label htmlFor="partner_subcription">Partner</label>
                                    <Dropdown optionLabel="name" value={dataSubscription.partner} onChange={(e) => setDataSubscription('partner', e.target.value)} options={partners} placeholder="Pilih Partner" 
                                    filter valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" />
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="period">Periode Langganan (Bulan)</label>
                                    <InputText keyfilter="int" min={1} value={dataSubscription.period} onChange={(e) => setDataSubscription('period', e.target.value)} className='dark:bg-gray-300' id="period" aria-describedby="period-help" />
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="nominal">Nominal</label>
                                    <InputNumber value={dataSubscription.nominal} onValueChange={(e) => setDataSubscription('nominal', e.target.value)} locale="id-ID" />
                                </div>


                                <div className='flex flex-col'> 
                                        <div className="flex justify-center">
                                            { !inputPriceCard && (
                                                <Button label="Input Tarif Kartu" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceCard(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                            )}
                                        </div>  

                                        { inputPriceCard && (
                                            <>
                                            <label htmlFor="price_card">Tarif Kartu</label>

                                            <div className="flex justify-between gap-1 w-full items-center">
                                                <div className='w-[95%] flex gap-2 h-full'>
                                                    <InputNumber placeholder='tarif' value={dataSubscription.price_card.price} onValueChange={(e) => setDataSubscription('price_card',{...dataSubscription.price_card, price : e.target.value})} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale="id-ID"/>
                                                    <Dropdown value={dataSubscription.price_card.type} onChange={(e) => setDataSubscription('price_card',{...dataSubscription.price_card, type : e.target.value})} options={cardCategories} optionLabel="name" 
                                                    placeholder="kategori" className="w-full md:w-14rem" />
                                                </div>
                                                <div className='h-full flex items-center'>
                                                <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceCard(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                                </div>

                                            </div>
                                            </>
                                        
                                        )}

                                </div>
                                    
                                <div className='flex flex-col'> 
                                    <div className="flex justify-center">
                                        { !inputPriceLanyard && (
                                            <Button label="Input Tarif Lanyard" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceLanyard(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                        )}
                                    </div>  

                                    { inputPriceLanyard && (
                                        <>
                                        <label htmlFor="price_card">Tarif Lanyard</label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className='w-[95%] flex gap-2 h-full'>
                                                <InputNumber placeholder='tarif' value={dataSubscription.price_lanyard} onValueChange={(e) => setDataSubscription('price_lanyard', e.target.value)} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale="id-ID" />
                                            </div>
                                            <div className='h-full flex items-center'>
                                            <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceLanyard(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                            </div>

                                        </div>
                                        </>
                                    
                                    )}
                                </div>
                                
                                <div className='flex flex-col'> 
                                    <div className="flex justify-center">
                                        { !inputPriceSubscriptionSystem && (
                                            <Button label="Input Tarif Langganan Sistem" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceSubscriptionSystem(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                        )}
                                    </div>  

                                    { inputPriceSubscriptionSystem && (
                                        <>
                                        <label htmlFor="price_card">Tarif Langganan Sistem</label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className='w-[95%] flex gap-2 h-full'>
                                                <InputNumber placeholder='tarif' value={dataSubscription.price_subscription_system} onValueChange={(e) => setDataSubscription('price_subscription_system', e.target.value)} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale='id-ID' />
                                            </div>
                                            <div className='h-full flex items-center'>
                                            <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceSubscriptionSystem(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                            </div>

                                        </div>
                                        </>
                                    
                                    )}
                                </div>

                                <div className='flex flex-col'> 
                                    <div className="flex justify-center">
                                        { !inputPriceTraining && (
                                            <Button label="Input Tarif Langganan Sistem" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceTraining(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                        )}
                                    </div>  

                                    { inputPriceTraining && (
                                        <>
                                        <label htmlFor="price_card">Tarif Pelatihan</label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className='w-[95%] flex gap-2 h-full'>
                                                <InputNumber placeholder='tarif' value={dataSubscription.price_training.price} onValueChange={(e) => setDataSubscription('price_training',{...dataSubscription.price_training, price : e.target.value})} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale='id-ID' />
                                                <Dropdown value={dataSubscription.price_training.type} onChange={(e) => setDataSubscription('price_training',{...dataSubscription.price_training, type : e.target.value})} options={trainingCategories} optionLabel="name" 
                                                placeholder="kategori" className="w-full md:w-14rem" />
                                            </div>
                                            <div className='h-full flex items-center'>
                                            <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceTraining(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                            </div>

                                        </div>
                                        </>
                                    )}
                                </div>
                           
                            </div>
                            <div className='flex justify-center mt-5'>
                                <Button label="Submit" disabled={processingSubscription} className="bg-purple-600 text-sm shadow-md rounded-lg"/>
                            </div>

                            </form>
                        </Dialog>
                    </div>

                    {/* Modal edit langganan */}
                    <div className="card flex justify-content-center">
                        <Dialog
                            header="Langganan"
                            headerClassName="dark:glass dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                            contentClassName='dark:glass dark:text-white'
                            visible={modalEditSubscriptionIsVisible}
                            onHide={() => setModalEditSubscriptionIsVisible(false)}
                        >

                            <form onSubmit={(e) => handleSubmitFormSubscription(e, 'update')}>    
                    
                    
                            <div className='flex flex-col justify-around gap-4 mt-4'>
                                
                                <div className='flex flex-col'>    
                                    <label htmlFor="partner_subcription">Partner</label>
                                    <Dropdown optionLabel="name" value={dataSubscription.partner} onChange={(e) => setDataSubscription('partner', e.target.value)} options={partners} placeholder="Pilih Partner" 
                                    filter valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" />
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="period">Periode Langganan (Bulan)</label>
                                    <InputText keyfilter="int" min={1} value={dataSubscription.period} onChange={(e) => setDataSubscription('period', e.target.value)} className='dark:bg-gray-300' id="period" aria-describedby="period-help" />
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="nominal">Nominal</label>
                                    <InputNumber value={dataSubscription.nominal} onValueChange={(e) => setDataSubscription('nominal', e.target.value)} locale="id-ID" />
                                </div>

                                <div className='flex flex-col'> 
                                        <div className="flex justify-center">
                                            { !inputPriceCard && (
                                                <Button label="Input Tarif Kartu" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceCard(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                            )}
                                        </div>  

                                        { inputPriceCard && (
                                            <>
                                            <label htmlFor="price_card">Tarif Kartu</label>

                                            <div className="flex justify-between gap-1 w-full items-center">
                                                <div className='w-[95%] flex gap-2 h-full'>
                                                    <InputNumber placeholder='tarif' value={dataSubscription.price_card.price} onValueChange={(e) => setDataSubscription('price_card',{...dataSubscription.price_card, price : e.target.value})} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale="id-ID"/>
                                                    <Dropdown value={dataSubscription.price_card.type} onChange={(e) => setDataSubscription('price_card',{...dataSubscription.price_card, type : e.target.value})} options={cardCategories} optionLabel="name" 
                                                    placeholder="kategori" optionValue='name' className="w-full md:w-14rem" />
                                                </div>
                                                <div className='h-full flex items-center'>
                                                <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceCard(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                                </div>

                                            </div>
                                            </>
                                        
                                        )}

                                </div>
                                    
                                <div className='flex flex-col'> 
                                    <div className="flex justify-center">
                                        { !inputPriceLanyard && (
                                            <Button label="Input Tarif Lanyard" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceLanyard(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                        )}
                                    </div>  

                                    { inputPriceLanyard && (
                                        <>
                                        <label htmlFor="price_card">Tarif Lanyard</label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className='w-[95%] flex gap-2 h-full'>
                                                <InputNumber placeholder='tarif' value={dataSubscription.price_lanyard} onValueChange={(e) => setDataSubscription('price_lanyard', e.target.value)} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale="id-ID" />
                                            </div>
                                            <div className='h-full flex items-center'>
                                            <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceLanyard(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                            </div>

                                        </div>
                                        </>
                                    
                                    )}
                                </div>
                                
                                <div className='flex flex-col'> 
                                    <div className="flex justify-center">
                                        { !inputPriceSubscriptionSystem && (
                                            <Button label="Input Tarif Langganan Sistem" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceSubscriptionSystem(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                        )}
                                    </div>  

                                    { inputPriceSubscriptionSystem && (
                                        <>
                                        <label htmlFor="price_card">Tarif Langganan Sistem</label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className='w-[95%] flex gap-2 h-full'>
                                                <InputNumber placeholder='tarif' value={dataSubscription.price_subscription_system} onValueChange={(e) => setDataSubscription('price_subscription_system', e.target.value)} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale='id-ID' />
                                            </div>
                                            <div className='h-full flex items-center'>
                                            <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceSubscriptionSystem(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                            </div>

                                        </div>
                                        </>
                                    
                                    )}
                                </div>

                                <div className='flex flex-col'> 
                                    <div className="flex justify-center">
                                        { !inputPriceTraining && (
                                            <Button label="Input Tarif Pelatihan" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceTraining(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                        )}
                                    </div>  

                                    { inputPriceTraining && (
                                        <>
                                        <label htmlFor="price_card">Tarif Pelatihan</label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className='w-[95%] flex gap-2 h-full'>
                                                <InputNumber placeholder='tarif' value={dataSubscription.price_training.price} onValueChange={(e) => setDataSubscription('price_training',{...dataSubscription.price_training, price : e.target.value})} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale='id-ID' />
                                                <Dropdown value={dataSubscription.price_training.type} onChange={(e) => setDataSubscription('price_training',{...dataSubscription.price_training, type : e.target.value})} options={trainingCategories} optionLabel="name" 
                                                placeholder="kategori" optionValue='name' className="w-full md:w-14rem" />
                                            </div>
                                            <div className='h-full flex items-center'>
                                            <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceTraining(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                            </div>

                                        </div>
                                        </>
                                    )}
                                </div>
                           
                            </div>
                            <div className='flex justify-center mt-5'>
                                <Button label="Submit" disabled={processingSubscription} className="bg-purple-600 text-sm shadow-md rounded-lg"/>
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
                            emptyMessage="Langganan partner tidak ditemukan."
                            paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                            header={header}
                            filters={filters}
                            globalFilterFields={['partner.name','period']}
                            value={subscriptions} dataKey="id" >
                                <Column header="No" body={(_, { rowIndex }) => rowIndex + 1} className='dark:border-none pl-6' headerClassName='dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300' style={{ width:'3%' }}/>
                                <Column header="Partner" body={(rowData) => <button onClick={ () => handleSelectedDetailPartner(rowData.partner)} className='hover:text-blue-700'>{rowData.partner.name}</button>} className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '10%' }}></Column>
                                <Column header="Nominal" body={(rowData) => rowData.nominal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column header="Periode Langganan" body={(rowData) => rowData.period + ' bulan' } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '5%' }}></Column>
                                <Column header="Tarif Kartu" body={(rowData) => JSON.parse(rowData.price_card).price?.toLocaleString('id-ID') ? JSON.parse(rowData.price_card).price + `(${JSON.parse(rowData.price_card).type})` : 'Tidak diset' } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column header="Tarif Lanyard" body={(rowData) => rowData.price_lanyard?.toLocaleString('id-ID') ? rowData.price_lanyard : 'Tidak diset' } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column header="Tarif Langganan Sistem" body={(rowData) => rowData.price_subscription_system?.toLocaleString('id-ID') ? rowData.price_subscription_system : 'Tidak diset' } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column header="Tarif Training" body={(rowData) => JSON.parse(rowData.price_training).price !== null ? JSON.parse(rowData.price_training).price.toLocaleString('id-ID') + `(${JSON.parse(rowData.price_training).type})` : 'Tidak diset' } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '10%' }}></Column>
                                <Column field="uuid" hidden className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Nama" align='left'></Column>
                                
                                <Column header="Action" body={actionBodyTemplateSubscriptipn} style={{ width:'10%' }} className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300'></Column>
                            </DataTable>
                            
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Detail Partner">

                    <Dropdown optionLabel="name" value={selectedDetailPartner} onChange={(e) => setSelectedDetailPartner(e.target.value)} options={partners} placeholder="Pilih Partner" 
                    filter valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate} className="w-full mt-5 md:w-[40%] mx-auto flex justify-center rounded-lg shadow-md border-none" />
                

                    { selectedDetailPartner !== '' && <Card title={selectedDetailPartner.name} className='mt-5 mx-auto p-3 w-[85%] rounded-lg'>
                        <div className="flex gap-5 max-h-[400px]">
                            <div className='w-[40%]'>
                            <Menu model={menuDetailPartnerItems} className="w-full rounded-lg" />
                            </div>

                            <div class="w-full rounded-lg bg-gray-50/50 border overflow-y-auto max-h-full p-4">
                               
                                { activeMenu==="lembaga" && (
                                    <table class="w-full">
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">Nama</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{selectedDetailPartner.name}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">Sales</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{selectedDetailPartner.sales.name}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">Account Manager</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{selectedDetailPartner.account_manager.name}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">Tanggal Daftar</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{new Date(selectedDetailPartner.register_date).toLocaleDateString("id")}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">Tanggal Live</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{new Date(selectedDetailPartner.live_date).toLocaleDateString("id")}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">Address</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{selectedDetailPartner.address}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">Status</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12"><Badge value={selectedDetailPartner.status} className="text-white" severity={selectedDetailPartner.status == 'Aktif' ? 'success' : null || selectedDetailPartner.status == 'CLBK' ? 'info' : null || selectedDetailPartner.status == 'Proses' ? 'warning' : null || selectedDetailPartner.status == 'Non Aktif' ? 'danger' : null}></Badge></td>
                                    </tr>
                                    </table>
                                )}

                                { activeMenu==="bank" && (
                                    <table class="w-full">
                                
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">Bank</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{selectedDetailPartner.banks[0].bank}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">No. Rekening</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{selectedDetailPartner.banks[0].account_bank_number}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">Atas Nama</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{selectedDetailPartner.banks[0].account_bank_name}</td>
                                    </tr> 
                                  
                                    </table>
                                )}

                                { activeMenu==="pic" && (
                                    <table class="w-full">
                                
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">Nama</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{selectedDetailPartner.pics[0].name}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">Jabatan</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{selectedDetailPartner.pics[0].position}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">No. Telp</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{selectedDetailPartner.pics[0].number}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">Address</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{selectedDetailPartner.pics[0].address}</td>
                                    </tr>
                                  
                                    </table>
                                )}

                                { activeMenu==="langganan" && (
                                    <table class="w-full">
                                
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">Nominal</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{selectedDetailPartner.subscription.nominal}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">Periode</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{selectedDetailPartner.subscription.period} bulan</td>
                                    </tr>

                                    { selectedDetailPartner.subscription.price_card !== {} && <tr class="border-b">
                                        <td class="text-gray-700 text-base font-bold w-1/4">Kartu {JSON.parse(selectedDetailPartner.subscription.price_card).type}</td>
                                        <td class="text-gray-700 text-base w-[2%]">:</td>
                                        <td class="text-gray-700 text-base w-7/12">{JSON.parse(selectedDetailPartner.subscription.price_card).price}</td>
                                    </tr>}
                                   
                                  
                                    </table>
                                )}
                                
                            
                            </div>

                        </div>
                    </Card>}


                    {/* Modal tambah langganan */}
                    {/* <div className="card flex justify-content-center">
                        <Dialog
                            header="Langganan"
                            headerClassName="dark:glass dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                            contentClassName='dark:glass dark:text-white'
                            visible={modalSubscriptionIsVisible}
                            onHide={() => setModalSubscriptionIsVisible(false)}
                        >

                            <form onSubmit={(e) => handleSubmitFormSubscription(e, 'tambah')}>    
                    
                    
                            <div className='flex flex-col justify-around gap-4 mt-4'>
                                
                                <div className='flex flex-col'>    
                                    <label htmlFor="partner_subcription">Partner</label>
                                    <Dropdown optionLabel="name" value={dataSubscription.partner} onChange={(e) => setDataSubscription('partner', e.target.value)} options={partners} placeholder="Pilih Partner" 
                                    filter valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" />
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="period">Periode Langganan (Bulan)</label>
                                    <InputText keyfilter="int" min={1} value={dataSubscription.period} onChange={(e) => setDataSubscription('period', e.target.value)} className='dark:bg-gray-300' id="period" aria-describedby="period-help" />
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="nominal">Nominal</label>
                                    <InputNumber value={dataSubscription.nominal} onValueChange={(e) => setDataSubscription('nominal', e.target.value)} locale="id-ID" />
                                </div>


                                <div className='flex flex-col'> 
                                        <div className="flex justify-center">
                                            { !inputPriceCard && (
                                                <Button label="Input Tarif Kartu" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceCard(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                            )}
                                        </div>  

                                        { inputPriceCard && (
                                            <>
                                            <label htmlFor="price_card">Tarif Kartu</label>

                                            <div className="flex justify-between gap-1 w-full items-center">
                                                <div className='w-[95%] flex gap-2 h-full'>
                                                    <InputNumber placeholder='tarif' value={dataSubscription.price_card.price} onValueChange={(e) => setDataSubscription('price_card',{...dataSubscription.price_card, price : e.target.value})} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale="id-ID"/>
                                                    <Dropdown value={dataSubscription.price_card.type} onChange={(e) => setDataSubscription('price_card',{...dataSubscription.price_card, type : e.target.value})} options={cardCategories} optionLabel="name" 
                                                    placeholder="kategori" className="w-full md:w-14rem" />
                                                </div>
                                                <div className='h-full flex items-center'>
                                                <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceCard(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                                </div>

                                            </div>
                                            </>
                                        
                                        )}

                                </div>
                                    
                                <div className='flex flex-col'> 
                                    <div className="flex justify-center">
                                        { !inputPriceLanyard && (
                                            <Button label="Input Tarif Lanyard" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceLanyard(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                        )}
                                    </div>  

                                    { inputPriceLanyard && (
                                        <>
                                        <label htmlFor="price_card">Tarif Lanyard</label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className='w-[95%] flex gap-2 h-full'>
                                                <InputNumber placeholder='tarif' value={dataSubscription.price_lanyard} onValueChange={(e) => setDataSubscription('price_lanyard', e.target.value)} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale="id-ID" />
                                            </div>
                                            <div className='h-full flex items-center'>
                                            <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceLanyard(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                            </div>

                                        </div>
                                        </>
                                    
                                    )}
                                </div>
                                
                                <div className='flex flex-col'> 
                                    <div className="flex justify-center">
                                        { !inputPriceSubscriptionSystem && (
                                            <Button label="Input Tarif Langganan Sistem" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceSubscriptionSystem(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                        )}
                                    </div>  

                                    { inputPriceSubscriptionSystem && (
                                        <>
                                        <label htmlFor="price_card">Tarif Langganan Sistem</label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className='w-[95%] flex gap-2 h-full'>
                                                <InputNumber placeholder='tarif' value={dataSubscription.price_subscription_system} onValueChange={(e) => setDataSubscription('price_subscription_system', e.target.value)} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale='id-ID' />
                                            </div>
                                            <div className='h-full flex items-center'>
                                            <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceSubscriptionSystem(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                            </div>

                                        </div>
                                        </>
                                    
                                    )}
                                </div>

                                <div className='flex flex-col'> 
                                    <div className="flex justify-center">
                                        { !inputPriceTraining && (
                                            <Button label="Input Tarif Langganan Sistem" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceTraining(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                        )}
                                    </div>  

                                    { inputPriceTraining && (
                                        <>
                                        <label htmlFor="price_card">Tarif Pelatihan</label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className='w-[95%] flex gap-2 h-full'>
                                                <InputNumber placeholder='tarif' value={dataSubscription.price_training.price} onValueChange={(e) => setDataSubscription('price_training',{...dataSubscription.price_training, price : e.target.value})} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale='id-ID' />
                                                <Dropdown value={dataSubscription.price_training.type} onChange={(e) => setDataSubscription('price_training',{...dataSubscription.price_training, type : e.target.value})} options={trainingCategories} optionLabel="name" 
                                                placeholder="kategori" className="w-full md:w-14rem" />
                                            </div>
                                            <div className='h-full flex items-center'>
                                            <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceTraining(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                            </div>

                                        </div>
                                        </>
                                    )}
                                </div>
                           
                            </div>
                            <div className='flex justify-center mt-5'>
                                <Button label="Submit" disabled={processingSubscription} className="bg-purple-600 text-sm shadow-md rounded-lg"/>
                            </div>

                            </form>
                        </Dialog>
                    </div> */}

                    {/* Modal edit langganan */}
                    {/* <div className="card flex justify-content-center">
                        <Dialog
                            header="Langganan"
                            headerClassName="dark:glass dark:text-white"
                            className="bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white"
                            contentClassName='dark:glass dark:text-white'
                            visible={modalEditSubscriptionIsVisible}
                            onHide={() => setModalEditSubscriptionIsVisible(false)}
                        >

                            <form onSubmit={(e) => handleSubmitFormSubscription(e, 'update')}>    
                    
                    
                            <div className='flex flex-col justify-around gap-4 mt-4'>
                                
                                <div className='flex flex-col'>    
                                    <label htmlFor="partner_subcription">Partner</label>
                                    <Dropdown optionLabel="name" value={dataSubscription.partner} onChange={(e) => setDataSubscription('partner', e.target.value)} options={partners} placeholder="Pilih Partner" 
                                    filter valueTemplate={selectedOptionTemplate} itemTemplate={optionTemplate} className="w-full md:w-14rem" />
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="period">Periode Langganan (Bulan)</label>
                                    <InputText keyfilter="int" min={1} value={dataSubscription.period} onChange={(e) => setDataSubscription('period', e.target.value)} className='dark:bg-gray-300' id="period" aria-describedby="period-help" />
                                </div>

                                <div className='flex flex-col'>
                                    <label htmlFor="nominal">Nominal</label>
                                    <InputNumber value={dataSubscription.nominal} onValueChange={(e) => setDataSubscription('nominal', e.target.value)} locale="id-ID" />
                                </div>

                                <div className='flex flex-col'> 
                                        <div className="flex justify-center">
                                            { !inputPriceCard && (
                                                <Button label="Input Tarif Kartu" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceCard(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                            )}
                                        </div>  

                                        { inputPriceCard && (
                                            <>
                                            <label htmlFor="price_card">Tarif Kartu</label>

                                            <div className="flex justify-between gap-1 w-full items-center">
                                                <div className='w-[95%] flex gap-2 h-full'>
                                                    <InputNumber placeholder='tarif' value={dataSubscription.price_card.price} onValueChange={(e) => setDataSubscription('price_card',{...dataSubscription.price_card, price : e.target.value})} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale="id-ID"/>
                                                    <Dropdown value={dataSubscription.price_card.type} onChange={(e) => setDataSubscription('price_card',{...dataSubscription.price_card, type : e.target.value})} options={cardCategories} optionLabel="name" 
                                                    placeholder="kategori" optionValue='name' className="w-full md:w-14rem" />
                                                </div>
                                                <div className='h-full flex items-center'>
                                                <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceCard(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                                </div>

                                            </div>
                                            </>
                                        
                                        )}

                                </div>
                                    
                                <div className='flex flex-col'> 
                                    <div className="flex justify-center">
                                        { !inputPriceLanyard && (
                                            <Button label="Input Tarif Lanyard" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceLanyard(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                        )}
                                    </div>  

                                    { inputPriceLanyard && (
                                        <>
                                        <label htmlFor="price_card">Tarif Lanyard</label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className='w-[95%] flex gap-2 h-full'>
                                                <InputNumber placeholder='tarif' value={dataSubscription.price_lanyard} onValueChange={(e) => setDataSubscription('price_lanyard', e.target.value)} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale="id-ID" />
                                            </div>
                                            <div className='h-full flex items-center'>
                                            <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceLanyard(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                            </div>

                                        </div>
                                        </>
                                    
                                    )}
                                </div>
                                
                                <div className='flex flex-col'> 
                                    <div className="flex justify-center">
                                        { !inputPriceSubscriptionSystem && (
                                            <Button label="Input Tarif Langganan Sistem" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceSubscriptionSystem(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                        )}
                                    </div>  

                                    { inputPriceSubscriptionSystem && (
                                        <>
                                        <label htmlFor="price_card">Tarif Langganan Sistem</label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className='w-[95%] flex gap-2 h-full'>
                                                <InputNumber placeholder='tarif' value={dataSubscription.price_subscription_system} onValueChange={(e) => setDataSubscription('price_subscription_system', e.target.value)} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale='id-ID' />
                                            </div>
                                            <div className='h-full flex items-center'>
                                            <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceSubscriptionSystem(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                            </div>

                                        </div>
                                        </>
                                    
                                    )}
                                </div>

                                <div className='flex flex-col'> 
                                    <div className="flex justify-center">
                                        { !inputPriceTraining && (
                                            <Button label="Input Tarif Langganan Sistem" className="text-purple-600 bg-transparent hover:text-white hover:bg-purple-600 hover:duration-100 text-sm" icon="pi pi-plus-circle" onClick={() => setInputPriceTraining(prev => prev=true)} aria-controls="popup_menu_right" aria-haspopup />
                                        )}
                                    </div>  

                                    { inputPriceTraining && (
                                        <>
                                        <label htmlFor="price_card">Tarif Pelatihan</label>

                                        <div className="flex justify-between gap-1 w-full items-center">
                                            <div className='w-[95%] flex gap-2 h-full'>
                                                <InputNumber placeholder='tarif' value={dataSubscription.price_training.price} onValueChange={(e) => setDataSubscription('price_training',{...dataSubscription.price_training, price : e.target.value})} className='dark:bg-gray-300 w-full' id="account_bank_name" aria-describedby="account_bank_name-help" locale='id-ID' />
                                                <Dropdown value={dataSubscription.price_training.type} onChange={(e) => setDataSubscription('price_training',{...dataSubscription.price_training, type : e.target.value})} options={trainingCategories} optionLabel="name" 
                                                placeholder="kategori" optionValue='name' className="w-full md:w-14rem" />
                                            </div>
                                            <div className='h-full flex items-center'>
                                            <Button className="bg-red-500 h-1 w-1 shadow-md rounded-full " icon={() => <i className="pi pi-minus" style={{ fontSize: '0.7rem' }}></i> } onClick={() => setInputPriceTraining(prev => prev=false)} aria-controls="popup_menu_right" aria-haspopup />    
                                            </div>

                                        </div>
                                        </>
                                    )}
                                </div>
                           
                            </div>
                            <div className='flex justify-center mt-5'>
                                <Button label="Submit" disabled={processingSubscription} className="bg-purple-600 text-sm shadow-md rounded-lg"/>
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
                            emptyMessage="Langganan partner tidak ditemukan."
                            paginatorClassName="dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg"
                            header={header}
                            filters={filters}
                            globalFilterFields={['partner.name','period']}
                            value={subscriptions} dataKey="id" >
                                <Column header="No" body={(_, { rowIndex }) => rowIndex + 1} className='dark:border-none pl-6' headerClassName='dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300' style={{ width:'3%' }}/>
                                <Column header="Partner" body={(rowData) => rowData.partner.name } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '10%' }}></Column>
                                <Column header="Nominal" body={(rowData) => rowData.nominal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column header="Periode Langganan" body={(rowData) => rowData.period + ' bulan' } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '5%' }}></Column>
                                <Column header="Tarif Kartu" body={(rowData) => JSON.parse(rowData.price_card).price.toLocaleString('id-ID') + ` (${JSON.parse(rowData.price_card).type})` } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column header="Tarif Lanyard" body={(rowData) => rowData.price_lanyard.toLocaleString('id-ID') } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column header="Tarif Langganan Sistem" body={(rowData) => rowData.price_subscription_system.toLocaleString('id-ID') } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '15%' }}></Column>
                                <Column header="Tarif Training" body={(rowData) => JSON.parse(rowData.price_training).price.toLocaleString('id-ID') + ` (${JSON.parse(rowData.price_training).type})` } className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' align='left' style={{ width: '10%' }}></Column>
                                <Column field="uuid" hidden className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300' header="Nama" align='left'></Column>
                                
                                <Column header="Action" body={actionBodyTemplateSubscriptipn} style={{ width:'10%' }} className='dark:border-none' headerClassName='dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300'></Column>
                            </DataTable>
                            
                        </div>
                    </div> */}
                </TabPanel>

            </TabView>

           
         
        </DashboardLayout>
    );
}
        