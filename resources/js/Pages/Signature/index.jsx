
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
import { Password } from 'primereact/password';
import { Skeleton } from 'primereact/skeleton';
import { FilterMatchMode } from 'primereact/api';



const index = ({ auth }) => {
    const [signature, setSignature] = useState([]);

    const getSignature = async () => {
        try {
            let response = await fetch('api/signature');
            let data = await response.json();
            console.log(data);
            setSignature(data);
        } catch (error) {
            console.error("Error fetching signature:", error);
        }
    }

    useEffect(() => {
        getSignature();
    }, []);

    return (
        <DashboardLayout auth={auth.user}>
            {signature.map((data) => {
                return (<>
                    <p>{data.user.name}</p>
                    <p>{data.image}</p>
                    <br />
                </>)
            })}
        </DashboardLayout>
    );
}

export default index;